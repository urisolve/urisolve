/**
 * Loads the file and validates the netlist
 * @returns netlist
 */
function loadFile(method) {
  // Caso não tenha sido inserida uma Netlist
  if (!fileContents[1]) {
    alert("Submit netlist first!!");
    return {
      first: true,
      second: 1,
      third: "No netlist file found",
    };
  }

  // Print sections
  document.getElementById("results-board").innerHTML = outHTMLSections();

  // Validate submitted Netlist File
  var netlistTxt = validateNetlist(fileContents[1]);
  // Check for previous ground alteration
  if (fileContents[2]) netlistTxt.first.push(fileContents[2]);
  // Deal With Netlist Error Codes
  let warningsText;
  $("#errors").hide();
  $("#warnings").hide();
  if (netlistTxt.first.length > 0) {
    if (foundCriticalErr(netlistTxt.first)) {
      $("#loadpage").fadeOut(1000);
      $("#results").show();
      $("#contResults").hide();
      $("#warnings").hide();
      $("#results-modal").modal("show");
      $("#errors").html(errorOutput(netlistTxt.first, method));
      $("#errors").show();
      document.getElementById("output-info-global").hidden = true;
      document.getElementById("buttons-div").hidden = true;

      let language = document
        .getElementById("lang-sel-txt")
        .innerText.toLowerCase();
      if (language == "english") set_lang(dictionary.english);
      else set_lang(dictionary.portuguese);
      return {
        first: true,
        second: 2,
        third: "Error",
      };
    }
  }
  document.getElementById("output-info-global").hidden = false;
  document.getElementById("buttons-div").hidden = false;
  // Remove codigo de erro 14
  if (fileContents[2]) netlistTxt.first.splice(netlistTxt.first.length - 1);
  return {
    first: false,
    second: 0,
    third: netlistTxt,
  };
}

/**
 * Imports data to local variables
 * @param {String} netlistTxt validated file
 */
function importData(netlistTxt) {
  var netListLines = netlistTxt.second;

  var netListLineCnt = {
    Vdc: 0,
    Idc: 0,
    Vac: 0,
    Iac: 0,
    R: 0,
    L: 0,
    C: 0,
    Vprob: 0,
    Iprob: 0,
  };

  // Import data to local variables
  for (var line = 0; line < netListLines.length; line++) {
    var cpData = acquireCpData(netListLines[line], netListLineCnt);

    if (cpData.third) {
      connections.push(cpData.third);
    }

    if (!cpData.first) {
      switch (cpData.second.type) {
        case cpRefTest("Vdc"): {
          var newDcVoltPs = new dcVoltPower(
            cpData.second.id,
            cpData.second.ref,
            cpData.second.noP,
            cpData.second.noN,
            cpData.second.type,
            cpData.second.value,
            cpData.second.unitMult,
            cpData.second.intRes,
            cpData.second.intResMult,
            null,
            null,
            null
          );
          dcVoltPs.push(newDcVoltPs);
          break;
        }

        case cpRefTest("Idc"): {
          var newDcAmpsPs = new dcCurrPower(
            cpData.second.id,
            cpData.second.ref,
            cpData.second.noP,
            cpData.second.noN,
            cpData.second.type,
            cpData.second.value,
            cpData.second.unitMult,
            cpData.second.intRes,
            cpData.second.intResMult,
            null,
            null,
            null,
            null,
            null
          );
          dcAmpsPs.push(newDcAmpsPs);
          break;
        }

        case cpRefTest("Vac"): {
          circuitAnalData.frequency.value = cpData.second.freq;
          circuitAnalData.frequency.mult = cpData.second.freqMult;
          var newAcVoltPs = new acVoltPower(
            cpData.second.id,
            cpData.second.ref,
            cpData.second.noP,
            cpData.second.noN,
            cpData.second.type,
            cpData.second.value,
            cpData.second.unitMult,
            cpData.second.intRes,
            cpData.second.intResMult,
            cpData.second.freq,
            cpData.second.freqMult,
            cpData.second.phase,
            cpData.second.theta,
            null,
            null,
            null
          );
          acVoltPs.push(newAcVoltPs);
          break;
        }

        case cpRefTest("Iac"): {
          circuitAnalData.frequency.value = cpData.second.freq;
          circuitAnalData.frequency.mult = cpData.second.freqMult;
          var newAcAmpsPs = new acCurrPower(
            cpData.second.id,
            cpData.second.ref,
            cpData.second.noP,
            cpData.second.noN,
            cpData.second.type,
            cpData.second.value,
            cpData.second.unitMult,
            cpData.second.intRes,
            cpData.second.intResMult,
            cpData.second.freq,
            cpData.second.freqMult,
            cpData.second.phase,
            cpData.second.theta,
            null,
            null,
            null
          );
          acAmpsPs.push(newAcAmpsPs);
          break;
        }

        case cpRefTest("R"): {
          var newResistor = new resistor(
            cpData.second.id,
            cpData.second.ref,
            cpData.second.noP,
            cpData.second.noN,
            cpData.second.type,
            cpData.second.value,
            cpData.second.unitMult,
            cpData.second.temp,
            null,
            null
          );
          resistors.push(newResistor);
          break;
        }

        case cpRefTest("L"): {
          var newCoil = new coil(
            cpData.second.id,
            cpData.second.ref,
            cpData.second.noP,
            cpData.second.noN,
            cpData.second.type,
            cpData.second.value,
            cpData.second.unitMult,
            cpData.second.initValue,
            null,
            null,
            null
          );
          coils.push(newCoil);
          break;
        }

        case cpRefTest("C"): {
          var newCapacitor = new capacitor(
            cpData.second.id,
            cpData.second.ref,
            cpData.second.noP,
            cpData.second.noN,
            cpData.second.type,
            cpData.second.value,
            cpData.second.unitMult,
            cpData.second.initValue,
            null,
            null,
            null
          );
          capacitors.push(newCapacitor);
          break;
        }

        case cpRefTest("VProbe"): {
          var newVoltMeter = new voltmeter(
            cpData.second.id,
            cpData.second.ref,
            cpData.second.noP,
            cpData.second.noN,
            cpData.second.type,
            cpData.second.intRes,
            cpData.second.intResMult,
            null,
            null
          );
          voltMeters.push(newVoltMeter);
          break;
        }

        case cpRefTest("IProbe"): {
          var newAmpsMeter = new ammeter(
            cpData.second.id,
            cpData.second.ref,
            cpData.second.noP,
            cpData.second.noN,
            cpData.second.type,
            cpData.second.intRes,
            cpData.second.intResMult,
            null,
            null
          );
          ampsMeters.push(newAmpsMeter);
          break;
        }

        default: {
          break;
        }
      }
    }
  }

  // Verify and set circuit frequency
  let errCodeIndex = netlistTxt.first.findIndex((item) => item.errorCode == 10);
  if (errCodeIndex > -1) {
    circuitAnalData.frequency.value = netlistTxt.first[errCodeIndex].chosenFreq;
    circuitAnalData.frequency.mult =
      netlistTxt.first[errCodeIndex].chosenFreqUnit;
  } else {
    for (var line = 0; line < netListLines.length; line++) {
      var cpData = acquireCpData(netListLines[line], netListLineCnt);

      if (!cpData.first) {
        if (cpData.second.value != null && cpData.second.type === "acFreq") {
          circuitAnalData.frequency.value = cpData.second.value;
          circuitAnalData.frequency.mult = cpData.second.mult;
        }
      }
    }
  }
}

/**
 * Saves the ammeter position and the component in series with it
 */
function manageAmpmeters() {
  for (var i = 0; i < ampsMeters.length; i++) {
    var newNodes = ampsMeters[i].getNodes();

    var found = iProbeNodesLoc.find((element) => element == newNodes);
    if (typeof found == "undefined") {
      iProbeNodesLoc.push(newNodes);
      // Save location of the ammeters in the iProbeNodesLoc and next series connected component Reference
      iProbeLocVsAmpId.push({
        iProbLocPos: iProbeNodesLoc.length - 1,
        ampId: ampsMeters[i].id,
        ampRef: ampsMeters[i].ref,
        serieConCpRef: "",
        branchId: "",
        jointNodeP: "",
        jointNodeN: "",
      });
    }

    found = iProbeNodesArr.find((element) => element == newNodes.fromNode);
    if (typeof found == "undefined") iProbeNodesArr.push(newNodes.fromNode);

    found = iProbeNodesArr.find((element) => element == newNodes.toNode);
    if (typeof found == "undefined") iProbeNodesArr.push(newNodes.toNode);
  }

  // Get a copy of ammeters reference and location
  iProbNodesLocFilled = iProbeNodesLoc.slice();
  iProbeNodesArrFilled = iProbeNodesArr.slice();
}

/**
 * Encounters the number and type of knots (real or virtual)
 */
function findNodes() {
  //find nodes
  var foundNodes = new Array();

  for (var i = 0; i < resistors.length; i++) {
    var newNodes = resistors[i].getNodes();
    var found = 0;

    var pos = newNodes.fromNode.search("_net");
    if (pos > -1) {
      // Verify ammeters Nodes
      found = iProbeNodesArr.find((element) => element == newNodes.fromNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.toNode;
          if (resistors[i].noN == found) resistors[i].noN = found2.toNode;
          if (resistors[i].noP == found) resistors[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = resistors[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.fromNode;
          if (resistors[i].noN == found) resistors[i].noN = found2.fromNode;
          if (resistors[i].noP == found) resistors[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = resistors[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var pos = newNodes.toNode.search("_net");
    if (pos > -1) {
      found = iProbeNodesArr.find((element) => element == newNodes.toNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.toNode;
          if (resistors[i].noN == found) resistors[i].noN = found2.toNode;
          if (resistors[i].noP == found) resistors[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = resistors[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.fromNode;
          if (resistors[i].noN == found) resistors[i].noN = found2.fromNode;
          if (resistors[i].noP == found) resistors[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = resistors[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    found = foundNodes.find((element) => element == newNodes.fromNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.fromNode);

    found = foundNodes.find((element) => element == newNodes.toNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.toNode);
  }

  for (var i = 0; i < coils.length; i++) {
    var newNodes = coils[i].getNodes();

    var pos = newNodes.fromNode.search("_net");
    if (pos > -1) {
      // Verify ammeters Nodes
      found = iProbeNodesArr.find((element) => element == newNodes.fromNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.toNode;
          if (coils[i].noN == found) coils[i].noN = found2.toNode;
          if (coils[i].noP == found) coils[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = coils[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.fromNode;
          if (coils[i].noN == found) coils[i].noN = found2.fromNode;
          if (coils[i].noP == found) coils[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = coils[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var pos = newNodes.toNode.search("_net");
    if (pos > -1) {
      found = iProbeNodesArr.find((element) => element == newNodes.toNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.toNode;
          if (coils[i].noN == found) coils[i].noN = found2.toNode;
          if (coils[i].noP == found) coils[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = coils[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.fromNode;
          if (coils[i].noN == found) coils[i].noN = found2.fromNode;
          if (coils[i].noP == found) coils[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = coils[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var found = foundNodes.find((element) => element == newNodes.fromNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.fromNode);

    var found = foundNodes.find((element) => element == newNodes.toNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.toNode);
  }

  for (var i = 0; i < capacitors.length; i++) {
    var newNodes = capacitors[i].getNodes();

    var pos = newNodes.fromNode.search("_net");
    if (pos > -1) {
      // Verify ammeters Nodes
      found = iProbeNodesArr.find((element) => element == newNodes.fromNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.toNode;
          if (capacitors[i].noN == found) capacitors[i].noN = found2.toNode;
          if (capacitors[i].noP == found) capacitors[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = capacitors[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.fromNode;
          if (capacitors[i].noN == found) capacitors[i].noN = found2.fromNode;
          if (capacitors[i].noP == found) capacitors[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = capacitors[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var pos = newNodes.toNode.search("_net");
    if (pos > -1) {
      found = iProbeNodesArr.find((element) => element == newNodes.toNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.toNode;
          if (capacitors[i].noN == found) capacitors[i].noN = found2.toNode;
          if (capacitors[i].noP == found) capacitors[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = capacitors[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.fromNode;
          if (capacitors[i].noN == found) capacitors[i].noN = found2.fromNode;
          if (capacitors[i].noP == found) capacitors[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = capacitors[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var found = foundNodes.find((element) => element == newNodes.fromNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.fromNode);

    var found = foundNodes.find((element) => element == newNodes.toNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.toNode);
  }

  for (var i = 0; i < dcVoltPs.length; i++) {
    var newNodes = dcVoltPs[i].getNodes();

    var pos = newNodes.fromNode.search("_net");
    if (pos > -1) {
      // Verify ammeters Nodes
      found = iProbeNodesArr.find((element) => element == newNodes.fromNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.toNode;
          if (dcVoltPs[i].noN == found) dcVoltPs[i].noN = found2.toNode;
          if (dcVoltPs[i].noP == found) dcVoltPs[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = dcVoltPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.fromNode;
          if (dcVoltPs[i].noN == found) dcVoltPs[i].noN = found2.fromNode;
          if (dcVoltPs[i].noP == found) dcVoltPs[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = dcVoltPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var pos = newNodes.toNode.search("_net");
    if (pos > -1) {
      found = iProbeNodesArr.find((element) => element == newNodes.toNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.toNode;
          if (dcVoltPs[i].noN == found) dcVoltPs[i].noN = found2.toNode;
          if (dcVoltPs[i].noP == found) dcVoltPs[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = dcVoltPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.fromNode;
          if (dcVoltPs[i].noN == found) dcVoltPs[i].noN = found2.fromNode;
          if (dcVoltPs[i].noP == found) dcVoltPs[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = dcVoltPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var found = foundNodes.find((element) => element == newNodes.fromNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.fromNode);

    var found = foundNodes.find((element) => element == newNodes.toNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.toNode);
  }

  for (var i = 0; i < acVoltPs.length; i++) {
    var newNodes = acVoltPs[i].getNodes();

    var pos = newNodes.fromNode.search("_net");
    if (pos > -1) {
      // Verify ammeters Nodes
      found = iProbeNodesArr.find((element) => element == newNodes.fromNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.toNode;
          if (acVoltPs[i].noN == found) acVoltPs[i].noN = found2.toNode;
          if (acVoltPs[i].noP == found) acVoltPs[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = acVoltPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.fromNode;
          if (acVoltPs[i].noN == found) acVoltPs[i].noN = found2.fromNode;
          if (acVoltPs[i].noP == found) acVoltPs[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = acVoltPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var pos = newNodes.toNode.search("_net");
    if (pos > -1) {
      found = iProbeNodesArr.find((element) => element == newNodes.toNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.toNode;
          if (acVoltPs[i].noN == found) acVoltPs[i].noN = found2.toNode;
          if (acVoltPs[i].noP == found) acVoltPs[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = acVoltPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.fromNode;
          if (acVoltPs[i].noN == found) acVoltPs[i].noN = found2.fromNode;
          if (acVoltPs[i].noP == found) acVoltPs[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = acVoltPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var found = foundNodes.find((element) => element == newNodes.fromNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.fromNode);

    var found = foundNodes.find((element) => element == newNodes.toNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.toNode);
  }

  for (var i = 0; i < dcAmpsPs.length; i++) {
    var newNodes = dcAmpsPs[i].getNodes();

    var pos = newNodes.fromNode.search("_net");
    if (pos > -1) {
      // Verify ammeters Nodes
      found = iProbeNodesArr.find((element) => element == newNodes.fromNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.toNode;
          if (dcAmpsPs[i].noN == found) dcAmpsPs[i].noN = found2.toNode;
          if (dcAmpsPs[i].noP == found) dcAmpsPs[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = dcAmpsPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.fromNode;
          if (dcAmpsPs[i].noN == found) dcAmpsPs[i].noN = found2.fromNode;
          if (dcAmpsPs[i].noP == found) dcAmpsPs[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = dcAmpsPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var pos = newNodes.toNode.search("_net");
    if (pos > -1) {
      found = iProbeNodesArr.find((element) => element == newNodes.toNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.toNode;
          if (dcAmpsPs[i].noN == found) dcAmpsPs[i].noN = found2.toNode;
          if (dcAmpsPs[i].noP == found) dcAmpsPs[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = dcAmpsPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.fromNode;
          if (dcAmpsPs[i].noN == found) dcAmpsPs[i].noN = found2.fromNode;
          if (dcAmpsPs[i].noP == found) dcAmpsPs[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = dcAmpsPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var found = foundNodes.find((element) => element == newNodes.fromNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.fromNode);

    var found = foundNodes.find((element) => element == newNodes.toNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.toNode);
  }

  for (var i = 0; i < acAmpsPs.length; i++) {
    var newNodes = acAmpsPs[i].getNodes();

    var pos = newNodes.fromNode.search("_net");
    if (pos > -1) {
      // Verify ammeters Nodes
      found = iProbeNodesArr.find((element) => element == newNodes.fromNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.toNode;
          if (acAmpsPs[i].noN == found) acAmpsPs[i].noN = found2.toNode;
          if (acAmpsPs[i].noP == found) acAmpsPs[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = acAmpsPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.fromNode = found2.fromNode;
          if (acAmpsPs[i].noN == found) acAmpsPs[i].noN = found2.fromNode;
          if (acAmpsPs[i].noP == found) acAmpsPs[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = acAmpsPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var pos = newNodes.toNode.search("_net");
    if (pos > -1) {
      found = iProbeNodesArr.find((element) => element == newNodes.toNode);
      // If was found in the general array, do the change
      if (typeof found != "undefined") {
        var found2 = iProbeNodesLoc.find(
          (element) => element.fromNode == found
        );
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.toNode;
          if (acAmpsPs[i].noN == found) acAmpsPs[i].noN = found2.toNode;
          else if (acAmpsPs[i].noP == found) acAmpsPs[i].noP = found2.toNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = acAmpsPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
        found2 = iProbeNodesLoc.find((element) => element.toNode == found);
        if (typeof found2 != "undefined") {
          // First in the fromNode
          newNodes.toNode = found2.fromNode;
          if (acAmpsPs[i].noN == found) acAmpsPs[i].noN = found2.fromNode;
          else if (acAmpsPs[i].noP == found) acAmpsPs[i].noP = found2.fromNode;

          // Save component Ref in iProbeLocVsAmpId
          var index = iProbNodesLocFilled.indexOf(found2);
          const locIndex = iProbeLocVsAmpId.findIndex(
            (item) => item.iProbLocPos == index
          );
          iProbeLocVsAmpId[locIndex].serieConCpRef = acAmpsPs[i].ref;

          // Clear pending ammeters nodes
          index = iProbeNodesArr.indexOf(found);
          if (index > -1) {
            iProbeNodesArr.splice(index, 1);
          }

          // Clear pending ammeters nodes location
          index = iProbeNodesLoc.indexOf(found2);
          if (index > -1) {
            iProbeNodesLoc.splice(index, 1);
          }
        }
      }
    }

    var found = foundNodes.find((element) => element == newNodes.fromNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.fromNode);

    var found = foundNodes.find((element) => element == newNodes.toNode);
    if (typeof found == "undefined") foundNodes.push(newNodes.toNode);
  }
  foundNodes.sort();
  let foundnodeInstances = [].concat(...connections);

  // Push nodes data to nodes array
  for (var i = 0; i < foundNodes.length; i++) {
    var nodeId = ++circuitAnalCnt.node;
    var nodeType = 1; // Virtual Node
    var pos = foundnodeInstances.filter(function (x) {
      return x === foundNodes[i];
    }).length;
    if (pos > 2) nodeType = 0; // Real Node
    var newNode = new node(nodeId, foundNodes[i], [], nodeType, null);
    nodes.push(newNode);
  }

  /*
	for(let i = 0; i < ampsMeters.length; i++){
		for(let j = 0; j < nodes.length; j++){
			if(ampsMeters[i].noP == nodes[j].ref || nodes[j].type == 0){
				for(let k = 0; k < nodes.length; k++){
					if(ampsMeters[i].noN == nodes[k].ref || nodes[k].type == 0){
						
					}
				}
			}
		}
		
	}
	*/

  return {
    first: false,
    second: 0,
  };
}

/**
 * Encouters the number and content of the branches of the circuit
 */
function makeBranches() {
  // Insert components into branches and Count Branches

  // Get a copy of components
  var resisTemp = resistors.slice();
  var coilsTemp = coils.slice();
  var capacTemp = capacitors.slice();
  var dcVPsTemp = dcVoltPs.slice();
  var dcAPsTemp = dcAmpsPs.slice();
  var acVPsTemp = acVoltPs.slice();
  var acAPsTemp = acAmpsPs.slice();

  // For each node, follow components until reach another Real Node, while creating Branches and set its data
  // This Operation is Successful if ends up with every array copy of components empty

  for (var i = 0; i < nodes.length; i++) {
    // If it is a Real Node
    if (nodes[i].type == 0) {
      nodeRef = nodes[i].ref;

      // Count occurrences
      var foundCnt = 0;
      for (var j = 0; j < resisTemp.length; j++) {
        if (resisTemp[j].noP == nodeRef || resisTemp[j].noN == nodeRef)
          foundCnt++;
      }
      for (var j = 0; j < coilsTemp.length; j++) {
        if (coilsTemp[j].noP == nodeRef || coilsTemp[j].noN == nodeRef)
          foundCnt++;
      }
      for (var j = 0; j < capacTemp.length; j++) {
        if (capacTemp[j].noP == nodeRef || capacTemp[j].noN == nodeRef)
          foundCnt++;
      }
      for (var j = 0; j < dcVPsTemp.length; j++) {
        if (dcVPsTemp[j].noP == nodeRef || dcVPsTemp[j].noN == nodeRef)
          foundCnt++;
      }
      for (var j = 0; j < dcAPsTemp.length; j++) {
        if (dcAPsTemp[j].noP == nodeRef || dcAPsTemp[j].noN == nodeRef)
          foundCnt++;
      }
      for (var j = 0; j < acVPsTemp.length; j++) {
        if (acVPsTemp[j].noP == nodeRef || acVPsTemp[j].noN == nodeRef)
          foundCnt++;
      }
      for (var j = 0; j < acAPsTemp.length; j++) {
        if (acAPsTemp[j].noP == nodeRef || acAPsTemp[j].noN == nodeRef)
          foundCnt++;
      }

      //		* CP Search States Machine (cpSearchSM):
      //			1 - Resistors;
      //			2 - Coils;
      //			3 - Capacitors;
      //			4 - DC Volt PS;
      //			5 - DC Amp PS;
      //			6 - AC Volt PS;
      //			7 - AC Amp PS.

      for (var j = 0; j < foundCnt; j++) {
        var end = 0;
        var cpSearchSM = 1;
        var branchId = ++circuitAnalCnt.branch;
        var newBranch = new branch(branchId, null, nodeRef);
        do {
          switch (cpSearchSM) {
            case 1: {
              if (resisTemp.length == 0) cpSearchSM++;
              for (var k = 0; k < resisTemp.length; k++) {
                if (resisTemp[k].noP == nodeRef) {
                  var nextNode = resisTemp[k].noN;
                  newBranch.resistors.push(resisTemp[k]);

                  // remove entry from component array (copy)
                  resisTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (resisTemp[k].noN == nodeRef) {
                  var nextNode = resisTemp[k].noP;
                  newBranch.resistors.push(resisTemp[k]);

                  // remove entry from component array (copy)
                  resisTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (k == resisTemp.length - 1) cpSearchSM++;
              }
              break;
            }

            case 2: {
              if (coilsTemp.length == 0) cpSearchSM++;
              for (var k = 0; k < coilsTemp.length; k++) {
                if (coilsTemp[k].noP == nodeRef) {
                  var nextNode = coilsTemp[k].noN;
                  newBranch.coils.push(coilsTemp[k]);

                  // remove entry from component array (copy)
                  coilsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (coilsTemp[k].noN == nodeRef) {
                  var nextNode = coilsTemp[k].noP;
                  newBranch.coils.push(coilsTemp[k]);

                  // remove entry from component array (copy)
                  coilsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (k == coilsTemp.length - 1) cpSearchSM++;
              }
              break;
            }

            case 3: {
              if (capacTemp.length == 0) cpSearchSM++;
              for (var k = 0; k < capacTemp.length; k++) {
                if (capacTemp[k].noP == nodeRef) {
                  var nextNode = capacTemp[k].noN;
                  newBranch.capacitors.push(capacTemp[k]);

                  // remove entry from component array (copy)
                  capacTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (capacTemp[k].noN == nodeRef) {
                  var nextNode = capacTemp[k].noP;
                  newBranch.capacitors.push(capacTemp[k]);

                  // remove entry from component array (copy)
                  capacTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (k == capacTemp.length - 1) cpSearchSM++;
              }
              break;
            }

            case 4: {
              if (dcVPsTemp.length == 0) cpSearchSM++;
              for (var k = 0; k < dcVPsTemp.length; k++) {
                if (dcVPsTemp[k].noP == nodeRef) {
                  var nextNode = dcVPsTemp[k].noN;
                  newBranch.dcVoltPwSupplies.push(dcVPsTemp[k]);

                  // remove entry from component array (copy)
                  dcVPsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (dcVPsTemp[k].noN == nodeRef) {
                  var nextNode = dcVPsTemp[k].noP;
                  newBranch.dcVoltPwSupplies.push(dcVPsTemp[k]);

                  // remove entry from component array (copy)
                  dcVPsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (k == dcVPsTemp.length - 1) cpSearchSM++;
              }
              break;
            }

            case 5: {
              if (dcAPsTemp.length == 0) cpSearchSM++;
              for (var k = 0; k < dcAPsTemp.length; k++) {
                if (dcAPsTemp[k].noP == nodeRef) {
                  var nextNode = dcAPsTemp[k].noN;
                  newBranch.dcAmpPwSupplies.push(dcAPsTemp[k]);

                  // remove entry from component array (copy)
                  dcAPsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (dcAPsTemp[k].noN == nodeRef) {
                  var nextNode = dcAPsTemp[k].noP;
                  newBranch.dcAmpPwSupplies.push(dcAPsTemp[k]);

                  // remove entry from component array (copy)
                  dcAPsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (k == dcAPsTemp.length - 1) cpSearchSM++;
              }
              break;
            }

            case 6: {
              if (acVPsTemp.length == 0) cpSearchSM++;
              for (var k = 0; k < acVPsTemp.length; k++) {
                if (acVPsTemp[k].noP == nodeRef) {
                  var nextNode = acVPsTemp[k].noN;
                  newBranch.acVoltPwSupplies.push(acVPsTemp[k]);

                  // remove entry from component array (copy)
                  acVPsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (acVPsTemp[k].noN == nodeRef) {
                  var nextNode = acVPsTemp[k].noP;
                  newBranch.acVoltPwSupplies.push(acVPsTemp[k]);

                  // remove entry from component array (copy)
                  acVPsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (k == acVPsTemp.length - 1) cpSearchSM++;
              }
              break;
            }

            case 7: {
              if (acAPsTemp.length == 0) cpSearchSM++;
              for (var k = 0; k < acAPsTemp.length; k++) {
                if (acAPsTemp[k].noP == nodeRef) {
                  var nextNode = acAPsTemp[k].noN;
                  newBranch.acAmpPwSupplies.push(acAPsTemp[k]);

                  // remove entry from component array (copy)
                  acAPsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (acAPsTemp[k].noN == nodeRef) {
                  var nextNode = acAPsTemp[k].noP;
                  newBranch.acAmpPwSupplies.push(acAPsTemp[k]);

                  // remove entry from component array (copy)
                  acAPsTemp.splice(k, 1);

                  // If next node is Real, Branch is Complete
                  var c1 = nextNode.search("_net");
                  if (c1 < 0) {
                    // Set final branch node
                    newBranch.endNode = nextNode;
                    // Save branch data into Branches Array
                    branches.push(newBranch);
                    // Reset node ref to search again
                    nodeRef = nodes[i].ref;
                    // End first foundCnt iteration
                    end = 1;
                    // Exit States Machine
                    break;
                  }
                  nodeRef = nextNode;
                  // Return to resistors in a new iteration
                  cpSearchSM = 1;
                  // Exit States Machine
                  break;
                }
                if (k == acAPsTemp.length - 1) cpSearchSM++;
              }
              break;
            }

            default: {
              end = 1;
              continue;
            }
          }
        } while (end == 0);
      }
    }
  }
}

/**
 * Gives direction to the currents in the branches
 */
function branchCurrents() {
  // Analyse Branches vs ammeterss (Currents Names)
  // Now its possible to analyse if it was provided One ammeters for the branch
  // If it is there, we can use its Reference to use in the Output (Current Reference)
  // If not, produce a Unique Id for each Current

  // Produce below a function to search for ammeters Nodes

  // Update branches information with ammeterss Data and Next component
  for (var i = 0; i < iProbeLocVsAmpId.length; i++) {
    let ampRef = iProbeLocVsAmpId[i].ampRef;
    let serieConCpRef = iProbeLocVsAmpId[i].serieConCpRef;

    for (var j = 0; j < branches.length; j++) {
      if (branches[j].resistors.length > 0) {
        const refIndex = branches[j].resistors.findIndex(
          (item) => item.ref == serieConCpRef
        );
        if (refIndex > -1) {
          const ampIndex = ampsMeters.findIndex((item) => item.ref == ampRef);
          if (ampIndex > -1) {
            // Save JointNode for ammeters
            if (ampsMeters[ampIndex].noP == branches[j].resistors[refIndex].noP)
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].resistors[refIndex].noP;
            if (ampsMeters[ampIndex].noP == branches[j].resistors[refIndex].noN)
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].resistors[refIndex].noN;
            if (ampsMeters[ampIndex].noN == branches[j].resistors[refIndex].noP)
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].resistors[refIndex].noP;
            if (ampsMeters[ampIndex].noN == branches[j].resistors[refIndex].noN)
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].resistors[refIndex].noN;
            // Save ammeters data to branch
            branches[j].ammeters = ampsMeters[ampIndex];
          }
          break;
        }
      }

      if (branches[j].coils.length > 0) {
        refIndex = branches[j].coils.findIndex(
          (item) => item.ref == serieConCpRef
        );
        if (refIndex > -1) {
          const ampIndex = ampsMeters.findIndex((item) => item.ref == ampRef);
          if (ampIndex > -1) {
            // Save JointNode for ammeters
            if (ampsMeters[ampIndex].noP == branches[j].coils[refIndex].noP)
              iProbeLocVsAmpId[i].jointNodeP = branches[j].coils[refIndex].noP;
            if (ampsMeters[ampIndex].noP == branches[j].coils[refIndex].noN)
              iProbeLocVsAmpId[i].jointNodeP = branches[j].coils[refIndex].noN;
            if (ampsMeters[ampIndex].noN == branches[j].coils[refIndex].noP)
              iProbeLocVsAmpId[i].jointNodeN = branches[j].coils[refIndex].noP;
            if (ampsMeters[ampIndex].noN == branches[j].coils[refIndex].noN)
              iProbeLocVsAmpId[i].jointNodeN = branches[j].coils[refIndex].noN;
            // Save ammeters data to branch
            branches[j].ammeters = ampsMeters[ampIndex];
          }
          break;
        }
      }

      if (branches[j].capacitors.length > 0) {
        refIndex = branches[j].capacitors.findIndex(
          (item) => item.ref == serieConCpRef
        );
        if (refIndex > -1) {
          const ampIndex = ampsMeters.findIndex((item) => item.ref == ampRef);
          if (ampIndex > -1) {
            // Save JointNode for ammeters
            if (
              ampsMeters[ampIndex].noP == branches[j].capacitors[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].capacitors[refIndex].noP;
            if (
              ampsMeters[ampIndex].noP == branches[j].capacitors[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].capacitors[refIndex].noN;
            if (
              ampsMeters[ampIndex].noN == branches[j].capacitors[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].capacitors[refIndex].noP;
            if (
              ampsMeters[ampIndex].noN == branches[j].capacitors[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].capacitors[refIndex].noN;
            // Save ammeters data to branch
            branches[j].ammeters = ampsMeters[ampIndex];
          }
          break;
        }
      }

      if (branches[j].dcVoltPwSupplies.length > 0) {
        refIndex = branches[j].dcVoltPwSupplies.findIndex(
          (item) => item.ref == serieConCpRef
        );
        if (refIndex > -1) {
          const ampIndex = ampsMeters.findIndex((item) => item.ref == ampRef);
          if (ampIndex > -1) {
            // Save JointNode for ammeters
            if (
              ampsMeters[ampIndex].noP ==
              branches[j].dcVoltPwSupplies[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].dcVoltPwSupplies[refIndex].noP;
            if (
              ampsMeters[ampIndex].noP ==
              branches[j].dcVoltPwSupplies[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].dcVoltPwSupplies[refIndex].noN;
            if (
              ampsMeters[ampIndex].noN ==
              branches[j].dcVoltPwSupplies[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].dcVoltPwSupplies[refIndex].noP;
            if (
              ampsMeters[ampIndex].noN ==
              branches[j].dcVoltPwSupplies[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].dcVoltPwSupplies[refIndex].noN;
            // Save ammeters data to branch
            branches[j].ammeters = ampsMeters[ampIndex];
          }
          break;
        }
      }

      if (branches[j].acVoltPwSupplies.length > 0) {
        refIndex = branches[j].acVoltPwSupplies.findIndex(
          (item) => item.ref == serieConCpRef
        );
        if (refIndex > -1) {
          const ampIndex = ampsMeters.findIndex((item) => item.ref == ampRef);
          if (ampIndex > -1) {
            // Save JointNode for ammeters
            if (
              ampsMeters[ampIndex].noP ==
              branches[j].acVoltPwSupplies[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].acVoltPwSupplies[refIndex].noP;
            if (
              ampsMeters[ampIndex].noP ==
              branches[j].acVoltPwSupplies[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].acVoltPwSupplies[refIndex].noN;
            if (
              ampsMeters[ampIndex].noN ==
              branches[j].acVoltPwSupplies[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].acVoltPwSupplies[refIndex].noP;
            if (
              ampsMeters[ampIndex].noN ==
              branches[j].acVoltPwSupplies[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].acVoltPwSupplies[refIndex].noN;
            // Save ammeters data to branch
            branches[j].ammeters = ampsMeters[ampIndex];
          }
          break;
        }
      }

      if (branches[j].dcAmpPwSupplies.length > 0) {
        refIndex = branches[j].dcAmpPwSupplies.findIndex(
          (item) => item.ref == serieConCpRef
        );
        if (refIndex > -1) {
          const ampIndex = ampsMeters.findIndex((item) => item.ref == ampRef);
          if (ampIndex > -1) {
            // Save JointNode for ammeters
            if (
              ampsMeters[ampIndex].noP ==
              branches[j].dcAmpPwSupplies[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].dcAmpPwSupplies[refIndex].noP;
            if (
              ampsMeters[ampIndex].noP ==
              branches[j].dcAmpPwSupplies[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].dcAmpPwSupplies[refIndex].noN;
            if (
              ampsMeters[ampIndex].noN ==
              branches[j].dcAmpPwSupplies[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].dcAmpPwSupplies[refIndex].noP;
            if (
              ampsMeters[ampIndex].noN ==
              branches[j].dcAmpPwSupplies[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].dcAmpPwSupplies[refIndex].noN;
            // Save ammeters data to branch
            branches[j].ammeters = ampsMeters[ampIndex];
          }
          break;
        }
      }

      if (branches[j].acAmpPwSupplies.length > 0) {
        refIndex = branches[j].acAmpPwSupplies.findIndex(
          (item) => item.ref == serieConCpRef
        );
        if (refIndex > -1) {
          const ampIndex = ampsMeters.findIndex((item) => item.ref == ampRef);
          if (ampIndex > -1) {
            // Save JointNode for ammeters
            if (
              ampsMeters[ampIndex].noP ==
              branches[j].acAmpPwSupplies[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].acAmpPwSupplies[refIndex].noP;
            if (
              ampsMeters[ampIndex].noP ==
              branches[j].acAmpPwSupplies[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeP =
                branches[j].acAmpPwSupplies[refIndex].noN;
            if (
              ampsMeters[ampIndex].noN ==
              branches[j].acAmpPwSupplies[refIndex].noP
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].acAmpPwSupplies[refIndex].noP;
            if (
              ampsMeters[ampIndex].noN ==
              branches[j].acAmpPwSupplies[refIndex].noN
            )
              iProbeLocVsAmpId[i].jointNodeN =
                branches[j].acAmpPwSupplies[refIndex].noN;
            // Save ammeters data to branch
            branches[j].ammeters = ampsMeters[ampIndex];
          }
          break;
        }
      }
    }
  }

  for (let i = 0; i < branches.length; i++) {
    if (typeof branches[i].ammeters != "undefined") {
      let ampNoP = branches[i].ammeters.noP;
      let ampNoN = branches[i].ammeters.noN;
      // Verify if the ammeters is already connected to a Real Node
      if (ampNoP == branches[i].startNode) {
        branches[i].ammeters.noN = branches[i].endNode;
        continue;
      }
      if (ampNoP == branches[i].endNode) {
        branches[i].ammeters.noN = branches[i].startNode;
        continue;
      }
      if (ampNoN == branches[i].startNode) {
        branches[i].ammeters.noP = branches[i].endNode;
        continue;
      }
      if (ampNoN == branches[i].endNode) {
        branches[i].ammeters.noP = branches[i].startNode;
        continue;
      }

      let nodeIndex = iProbeLocVsAmpId.findIndex(
        (item) => item.ampRef == branches[i].ammeters.ref
      );
      let nextNode;
      let ampJoint; // True - noP; False - noN;
      if (
        iProbeLocVsAmpId[nodeIndex].jointNodeP == ampNoP ||
        iProbeLocVsAmpId[nodeIndex].jointNodeP == ampNoN
      ) {
        nextNode = ampNoP;
        ampJoint = true;
      }
      if (
        iProbeLocVsAmpId[nodeIndex].jointNodeN == ampNoN ||
        iProbeLocVsAmpId[nodeIndex].jointNodeN == ampNoP
      ) {
        nextNode = ampNoN;
        ampJoint = false;
      }
      let thisBranch = JSON.parse(JSON.stringify(branches[i]));
      // If not, follow the branch, starting with the next component
      let end = false;
      do {
        let pos = nextNode.search("_net");
        if (pos > -1) {
          nodeIndex = thisBranch.resistors.findIndex(
            (item) => item.noP == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.resistors[nodeIndex].noN;
            thisBranch.resistors.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.resistors.findIndex(
            (item) => item.noN == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.resistors[nodeIndex].noP;
            thisBranch.resistors.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.coils.findIndex(
            (item) => item.noP == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.coils[nodeIndex].noN;
            thisBranch.coils.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.coils.findIndex(
            (item) => item.noN == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.coils[nodeIndex].noP;
            thisBranch.coils.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.capacitors.findIndex(
            (item) => item.noP == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.capacitors[nodeIndex].noN;
            thisBranch.capacitors.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.capacitors.findIndex(
            (item) => item.noN == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.capacitors[nodeIndex].noP;
            thisBranch.capacitors.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.dcVoltPwSupplies.findIndex(
            (item) => item.noP == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.dcVoltPwSupplies[nodeIndex].noN;
            thisBranch.dcVoltPwSupplies.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.dcVoltPwSupplies.findIndex(
            (item) => item.noN == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.dcVoltPwSupplies[nodeIndex].noP;
            thisBranch.dcVoltPwSupplies.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.acVoltPwSupplies.findIndex(
            (item) => item.noP == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.acVoltPwSupplies[nodeIndex].noN;
            thisBranch.acVoltPwSupplies.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.acVoltPwSupplies.findIndex(
            (item) => item.noN == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.acVoltPwSupplies[nodeIndex].noP;
            thisBranch.acVoltPwSupplies.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.dcAmpPwSupplies.findIndex(
            (item) => item.noP == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.dcAmpPwSupplies[nodeIndex].noN;
            thisBranch.dcAmpPwSupplies.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.dcAmpPwSupplies.findIndex(
            (item) => item.noN == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.dcAmpPwSupplies[nodeIndex].noP;
            thisBranch.dcAmpPwSupplies.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.acAmpPwSupplies.findIndex(
            (item) => item.noP == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.acAmpPwSupplies[nodeIndex].noN;
            thisBranch.acAmpPwSupplies.splice(nodeIndex, 1);
            continue;
          }
          nodeIndex = thisBranch.acAmpPwSupplies.findIndex(
            (item) => item.noN == nextNode
          );
          if (nodeIndex > -1) {
            nextNode = thisBranch.acAmpPwSupplies[nodeIndex].noP;
            thisBranch.acAmpPwSupplies.splice(nodeIndex, 1);
            continue;
          }
        } else {
          if (nextNode == thisBranch.startNode) {
            if (!ampJoint) {
              branches[i].ammeters.noN = branches[i].endNode;
              branches[i].ammeters.noP = branches[i].startNode;
            }
            if (ampJoint) {
              branches[i].ammeters.noN = branches[i].startNode;
              branches[i].ammeters.noP = branches[i].endNode;
            }
          }
          if (nextNode == thisBranch.endNode) {
            if (!ampJoint) {
              branches[i].ammeters.noN = branches[i].startNode;
              branches[i].ammeters.noP = branches[i].endNode;
            }
            if (ampJoint) {
              branches[i].ammeters.noN = branches[i].endNode;
              branches[i].ammeters.noP = branches[i].startNode;
            }
          }
          end = true;
        }
      } while (!end);
    }
  }

  // If theres no ammeterss, produce Ids for Currents
  // Except for branches containing a Current Power Supply
  // Amperimeter Reference will be mandatory, over Current PS Reference

  var ampMeterVsampCurr = new Array();

  // Get Currents Refs
  let ampsRefs = new Array();
  for (let i = 0; i < dcAmpsPs.length; i++) {
    if (ampsRefs.indexOf(dcAmpsPs[i].ref) < 0) ampsRefs.push(dcAmpsPs[i].ref);
  }
  for (let i = 0; i < acAmpsPs.length; i++) {
    if (ampsRefs.indexOf(acAmpsPs[i].ref) < 0) ampsRefs.push(acAmpsPs[i].ref);
  }
  for (let i = 0; i < ampsMeters.length; i++) {
    if (ampsRefs.indexOf(ampsMeters[i].ref) < 0)
      ampsRefs.push(ampsMeters[i].ref);
  }

  for (let i = 0; i < branches.length; i++) {
    // Increment Internal Auto Reference
    let currId = ++circuitAnalCnt.current;

    let currRef = "";
    let currNoP = branches[i].startNode;
    let currNoN = branches[i].endNode;

    if (!branches[i].ammeters) {
      // Has Current Power Supplies?
      if (branches[i].dcAmpPwSupplies.length > 0) {
        currRef = branches[i].dcAmpPwSupplies[0].ref;
      }
      if (branches[i].acAmpPwSupplies.length > 0) {
        currRef = branches[i].acAmpPwSupplies[0].ref;
      }
    } else {
      // If this branch has an ammeters, assign its reference to the current
      // If this branch has a Current PS, save both in a separated array
      if (typeof branches[i].ammeters != "undefined") {
        // Has Current Power Supplies?
        if (branches[i].dcAmpPwSupplies.length > 0)
          ampMeterVsampCurr.push({
            ampMeter: branches[i].ammeters,
            currPs: branches[i].dcAmpPwSupplies[0],
          });
        if (branches[i].acAmpPwSupplies.length > 0)
          ampMeterVsampCurr.push({
            ampMeter: branches[i].ammeters,
            currPs: branches[i].acAmpPwSupplies[0],
          });

        currRef = branches[i].ammeters.ref;
        currNoP = branches[i].ammeters.noP;
        currNoN = branches[i].ammeters.noN;
      }
    }
    // If there's no name, create a unique one
    if (currRef == "") {
      var alreadyExists = 0;
      var currNb = 1;
      do {
        currRef = "I" + currNb;
        alreadyExists = ampsRefs.indexOf(currRef);
        if (alreadyExists > -1) currNb++;
      } while (alreadyExists > -1);
    }

    if (ampsRefs.indexOf(currRef) < 0) ampsRefs.push(currRef);
    let newCurr = new current(currId, currRef, currNoP, currNoN);
    currents.push(newCurr);

    // Update Branch Data
    branches[i].currentId = currId;
    branches[i].currentData = currents[currents.length - 1];
    // Update Branch Nodes (according to Current Direction)
    branches[i].startNode = currNoP;
    branches[i].endNode = currNoN;
  }

  let nodesArr = connections;
  // Compute dcAmps global nodes
  for (let i = 0; i < dcAmpsPs.length; i++) {
    // Remove the index from the array
    for (let k = 0; k < nodesArr.length; k++) {
      if (
        (nodesArr[k][0] == dcAmpsPs[i].noP &&
          nodesArr[k][1] == dcAmpsPs[i].noN) ||
        (nodesArr[k][0] == dcAmpsPs[i].noN && nodesArr[k][1] == dcAmpsPs[i].noP)
      ) {
        nodesArr.splice(k, 1);
        break;
      }
    }
    // Proccess positive Node
    if (!dcAmpsPs[i].noP.includes("_net"))
      dcAmpsPs[i].globalNoP = dcAmpsPs[i].noP;
    // If it isnt a real node find the end of the branch
    else {
      let finalNode = dcAmpsPs[i].noP;
      while (finalNode.includes("_net")) {
        // Search for the virtual node
        for (let k = 0; k < nodesArr.length; k++) {
          if (nodesArr[k].indexOf(finalNode) >= 0) {
            if (nodesArr[k].indexOf(finalNode) == 0) finalNode = nodesArr[k][1];
            else finalNode = nodesArr[k][0];
            nodesArr.splice(k, 1);
            break;
          }
        }
      }
      // Assign the globalPositiveNode
      dcAmpsPs[i].globalNoP = finalNode;
    }
    // Proccess negative Node
    if (!dcAmpsPs[i].noN.includes("_net"))
      dcAmpsPs[i].globalNoN = dcAmpsPs[i].noN;
    // If it isnt a real node find the end of the branch
    else {
      let finalNode = dcAmpsPs[i].noN;
      while (finalNode.includes("_net")) {
        // Search for the virtual node
        for (let k = 0; k < nodesArr.length; k++) {
          if (nodesArr[k].indexOf(finalNode) >= 0) {
            if (nodesArr[k].indexOf(finalNode) == 0) finalNode = nodesArr[k][1];
            else finalNode = nodesArr[k][0];
            nodesArr.splice(k, 1);
            break;
          }
        }
      }
      // Assign the globalNegativeNode
      dcAmpsPs[i].globalNoN = finalNode;
    }
  }

  // Compute acAmps global nodes
  for (let i = 0; i < acAmpsPs.length; i++) {
    // Remove the index from the array
    for (let k = 0; k < nodesArr.length; k++) {
      if (
        (nodesArr[k][0] == acAmpsPs[i].noP &&
          nodesArr[k][1] == acAmpsPs[i].noN) ||
        (nodesArr[k][0] == acAmpsPs[i].noN && nodesArr[k][1] == acAmpsPs[i].noP)
      ) {
        nodesArr.splice(k, 1);
        break;
      }
    }
    // Proccess positive Node
    if (!acAmpsPs[i].noP.includes("_net"))
      acAmpsPs[i].globalNoP = acAmpsPs[i].noP;
    // If it isnt a real node find the end of the branch
    else {
      let finalNode = acAmpsPs[i].noP;
      while (finalNode.includes("_net")) {
        // Search for the virtual node
        for (let k = 0; k < nodesArr.length; k++) {
          if (nodesArr[k].indexOf(finalNode) >= 0) {
            if (nodesArr[k].indexOf(finalNode) == 0) finalNode = nodesArr[k][1];
            else finalNode = nodesArr[k][0];
            nodesArr.splice(k, 1);
            break;
          }
        }
      }
      // Assign the globalPositiveNode
      acAmpsPs[i].globalNoP = finalNode;
    }
    // Proccess negative Node
    if (!acAmpsPs[i].noN.includes("_net"))
      acAmpsPs[i].globalNoN = acAmpsPs[i].noN;
    // If it isnt a real node find the end of the branch
    else {
      let finalNode = acAmpsPs[i].noN;
      while (finalNode.includes("_net")) {
        // Search for the virtual node
        for (let k = 0; k < nodesArr.length; k++) {
          if (nodesArr[k].indexOf(finalNode) >= 0) {
            if (nodesArr[k].indexOf(finalNode) == 0) finalNode = nodesArr[k][1];
            else finalNode = nodesArr[k][0];
            nodesArr.splice(k, 1);
            break;
          }
        }
      }
      // Assign the globalNegativeNode
      acAmpsPs[i].globalNoN = finalNode;
    }
  }

  // Update Branches start and end Nodes with Current Sources
  for (let i = 0; i < branches.length; i++) {
    if (branches[i].dcAmpPwSupplies.length > 0) {
      branches[i].startNode = branches[i].dcAmpPwSupplies[0].globalNoN;
      branches[i].endNode = branches[i].dcAmpPwSupplies[0].globalNoP;
      branches[i].currentData.noP = branches[i].dcAmpPwSupplies[0].globalNoN;
      branches[i].currentData.noN = branches[i].dcAmpPwSupplies[0].globalNoP;
    } else if (branches[i].acAmpPwSupplies.length > 0) {
      branches[i].startNode = branches[i].acAmpPwSupplies[0].globalNoP;
      branches[i].endNode = branches[i].acAmpPwSupplies[0].globalNoN;
      branches[i].currentData.noP = branches[i].acAmpPwSupplies[0].globalNoN;
      branches[i].currentData.noN = branches[i].acAmpPwSupplies[0].globalNoP;
    }
  }

  // Update Nodes with Branches Objects
  for (let i = 0; i < branches.length; i++) {
    let currNoP = branches[i].startNode;
    let currNoN = branches[i].endNode;
    let nodeIndex;
    nodeIndex = nodes.findIndex((item) => item.ref == currNoP);
    if (nodeIndex > -1) {
      nodes[nodeIndex].branches.push(branches[i]);
    }

    nodeIndex = nodes.findIndex((item) => item.ref == currNoN);
    if (nodeIndex > -1) {
      nodes[nodeIndex].branches.push(branches[i]);
    }
  }
}

/**
 * Cleans the variables
 */
function cleanData() {
  resistors = [];
  coils = [];
  capacitors = [];
  dcVoltPs = [];
  acVoltPs = [];
  dcAmpsPs = [];
  acAmpsPs = [];
  ampsMeters = [];
  var voltMeters = [];

  nodes = [];
  branches = [];
  currents = [];
  supernodes = [];
  connections = [];

  //Manage ampmeters
  iProbeNodesLoc = [];
  iProbeNodesArr = [];
  iProbeLocVsAmpId = [];

  // Circuit analysis counters
  circuitAnalCnt = {
    node: 0,
    branch: 0,
    current: 0,
    fsupernode: 0,
    gsupernode: 0,
  };

  // Circuit analysis global data
  circuitAnalData = {
    frequency: { value: 0, mult: "" },
  };
}

/**
 * Agregates voltPowerSources in series
 */
function agregatePowerSupplies() {
  for (let i = 0; i < branches.length; i++) {
    branches[i].setVoltPsEndNodes();
    branches[i].setEquivVoltPs();
    branches[i].setEquivImpedance(
      circuitAnalData.frequency.value,
      circuitAnalData.frequency.mult
    );
    branches[i].getReactance(
      circuitAnalData.frequency.value,
      circuitAnalData.frequency.mult
    );
  }
}

/**
 * Builds json file for further method analisys
 * @returns {String} stringyfied json file
 */
function buildJson(netlist) {
  var circuitFrequency = {
    value: circuitAnalData.frequency.value,
    mult: circuitAnalData.frequency.mult,
  };
  var componentsObj = {
    resistors: resistors,
    coils: coils,
    capacitors: capacitors,
    dcVoltPs: dcVoltPs,
    dcAmpsPs: dcAmpsPs,
    acVoltPs: acVoltPs,
    acAmpsPs: acAmpsPs,
  };
  var probesObj = { ammeters: ampsMeters, voltmeters: voltMeters };
  var analysisObj = {
    circuitFreq: circuitFrequency,
    currents: currents,
    warnings: netlist.first,
  };
  var appObj = {
    version: "0.0.0",
    details:
      "",
    releaseDate: "2022-6-28T18:00:00.000",
  };
  var outputJson = {
    app: appObj,
    components: componentsObj,
    probes: probesObj,
    nodes: nodes,
    branches: branches,
    analysisObj: analysisObj,
  };

  let jsonStr = JSON.stringify(outputJson);
  return jsonStr;
}

/**
 * commom - loads file and prepares info for all mehods
 * @returns stringyfied json file
 */
function common(method) {
  resistors = new Array();
  coils = new Array();
  capacitors = new Array();
  dcVoltPs = new Array();
  acVoltPs = new Array();
  dcAmpsPs = new Array();
  acAmpsPs = new Array();
  ampsMeters = new Array();
  voltMeters = new Array();
  connections = new Array();
  // Circuit analysis global data
  circuitAnalData = {
    frequency: { value: 0, mult: "" },
  };
  nodes = new Array();
  branches = new Array();
  currents = new Array();
  // Circuit analysis counters
  circuitAnalCnt = {
    node: 0,
    branch: 0,
    current: 0,
  };
  //Manage ampmeters
  iProbeNodesLoc = new Array();
  iProbeNodesArr = new Array();
  iProbeLocVsAmpId = new Array();

  let load = loadFile(method);
  if (load.first) {
    return {
      first: load.first,
      second: load.second,
      third: load.third,
    };
  }
  cleanData();
  importData(load.third);
  manageAmpmeters();
  findNodes();
  makeBranches();
  branchCurrents();
  agregatePowerSupplies();
  return {
    first: false,
    second: 0,
    third: buildJson(load.third),
  };
}

function analyseCircuit(analysismet) {
    loadingModalResults();
    switch (analysismet) {
        case "MTN":
            setTimeout(function() {
                let retriesNumber = 5;
                let successFlag = false;
                for (let i = 0; i < retriesNumber; i++) {
                    try {
                        loadFileAsTextMTN();
                        successFlag = true;
                    } catch (error) {
                        console.log("Error in MTN: " + error);
                        successFlag = false;
                    }
                    if (successFlag) {
                        break;
                    }
                    if(i== (retriesNumber-1)) {
                        alert("An error occurred. Please try again!");
                    }
                }
                $("#loadpage").hide();
            }, 500);
        break;
        case "MCR":
            setTimeout(function() {
                let retriesNumber = 5;
                let successFlag = false;
                for (let i = 0; i < retriesNumber; i++) {
                    try {
						let data = common(analysismet);
						if(!data.first){
						loadFileAsTextMCR(data.third);
                        }
                        successFlag = true;
                    } catch (error) {
                        console.log("Error in MCR: " + error);
                        successFlag = false;
                    }
                    if (successFlag) {
                        break;
                    }
                    if(i== (retriesNumber-1)) {
                        alert("An error occurred. Please try again!");
                    }
                }
                $("#loadpage").hide();
            }, 500);
        break;
        case "MCM":
            setTimeout(function() {
                let retriesNumber = 5;
                let successFlag = false;
                for (let i = 0; i < retriesNumber; i++) {
                    try {
                        let data = common(analysismet);
                        if(!data.first){
							loadFileAsTextMCM(data.third);
                        }
                        successFlag = true;
                    } catch (error) {
                        console.log("Error in MCM: " + error);
                        successFlag = false;
                    }
                    if (successFlag) {
                        break;
                    }
                    if(i== (retriesNumber-1)) {
                        alert("An error occurred. Please try again!");
                    }
                }
                $("#loadpage").hide();
            }, 500);
        break;
        default:
            $("#loadpage").hide();
            alert('Please select a valid analysis method.');
        break;
    }
};
