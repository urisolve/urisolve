function loadFileAsTextMCR() {
	if (!fileContents[1]) {
		alert("Upload Netlist file first!");

		return;
	}
	textFromFileLoaded = fileContents[1];
	var leng = textFromFileLoaded.length;
	function novajanela() {
		if (flagError == 1) {
			errorStr += "\nProcedures:\n1) Refresh the page\n2) Correct the circuit\n3) Upload new file"
			alert(errorStr)
		} else {
			/*var opened = window.open("");
			var htmlCode1 = "<!DOCTYPE html><html><head><link rel=\"stylesheet\" href=\"code/libs/KaTeX/katex.min.css\"><title>Solutions</title></head>";
			var htmlCode2 = "<body style=\"background-color:#ffffff;\"> <div style=\"position: relative; margin-top: 5%; margin-left: 10%; margin-right: 20%;\">";
			var htmlCode3 = "</div></body> </html>";
			opened.document.write(htmlCode1);
			opened.document.write(htmlCode2);
			//Teste gerar malhas
			opened.document.write(string_final)
			opened.document.write(htmlCode3);
			//document.write(matriz)
			*/
			var htmlstr = string_final;
			outputModalResults(htmlstr);
		}
	};
	//______________________resistors_________________________//
	var Resistors = [];
	var Pt1_resistors = [];
	var Pt2_resistors = [];
	var Ohm_resistors = [];
	Resistors = fill_resistors(textFromFileLoaded);
	Pt1_resistors = fill_pt1_resistors(textFromFileLoaded);
	Pt2_resistors = fill_pt2_resistors(textFromFileLoaded);
	Ohm_resistors = fill_ohm_resistors(textFromFileLoaded);
	var Qtd_resistors = Resistors.length;

	function fill_resistors(text) {
		var i = 0;
		var num_R = 0;
		var nomes = [];
		var ini_flag = 0;
		for (i = 0; i <= leng; i++) {
			if (text[i] == "R") {
				i++;
				if (text[i] == ":" && text[i + 1] == "R") {
					i++;
					while (text[i] != " ") {
						if (ini_flag == 1) {
							nomes[num_R] += text[i];
							i++;
						} else {
							ini_flag = 1;
							nomes[num_R] = text[i];
							i++;
						}
					}
					num_R++;
					ini_flag = 0;
				}
			}
		}
		return nomes;
	}

	function fill_pt1_resistors(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "R") {
				i++;
				if (text[i] == ":" && text[i + 1] == "R") {
					i++;
					while (text[i] != " ") {
						i++;
					}
					i++;
					nomes_no[num_no] = text[i];
					i++;
					while (text[i] != " ") {
						nomes_no[num_no] += text[i];
						i++;
					}
					num_no++;
				}
			}
		}
		return nomes_no;
	}

	function fill_pt2_resistors(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "R") {
				i++;
				if (text[i] == ":" && text[i + 1] == "R") {
					i++;
					while (text[i] != " ") {
						i++;
					}
					i++;
					while (text[i] != " ") {
						i++;
					}
					i++;
					nomes_no[num_no] = text[i];
					i++;
					while (text[i] != " ") {
						nomes_no[num_no] += text[i];
						i++;
					}
					num_no++;
				}
			}
		}
		return nomes_no;
	}

	function fill_ohm_resistors(text) {
		var ohmSI = 0;
		var num_R = 0;
		var ohm = [];
		var flag = 0;
		for (var i = 0; i <= leng; i++) {
			if (text[i] == "R") {
				i++;
				if (text[i] == ":" && text[i + 1] == "R") {
					i++;
					while (text[i] != " ") {
						i++;
					}
					i++;
					while (text[i] != " ") {
						i++;
					}
					i++;
					while (text[i] != " ") {
						i++;
					}
					i++;
					if (text[i] == "R") {
						i++;
						if (text[i] == "=") {
							i++;
							i++;
							ohm[num_R] = text[i];
							i++;
							while (text[i] != " ") {
								ohm[num_R] += text[i];
								i++;
							}
							i++
							/*if(text[i] == "O"){
								ohmSI = parseInt(ohm[num_R])
							}*/
							if (text[i] == "k") {
								ohmSI = parseInt(ohm[num_R])
								ohmSI = ohmSI * Math.pow(10, 3)
								flag = 1
							} else if (text[i] == "M") {
								ohmSI = parseInt(ohm[num_R])
								ohmSI = ohmSI * Math.pow(10, 6)
								flag = 1
							}
							if (flag == 1) {
								ohm[num_R] = ohmSI;
							}
							num_R++;
						}
					}
				}
			}
		}
		return ohm;
	}
	//___________________________________________________________//
	//______________________CAPACITORS_________________________//
	var Capacitors = [];
	var Pt1_capacitors = [];
	var Pt2_capacitors = [];
	var Farad_capacitors = [];
	Capacitors = fill_capacitors(textFromFileLoaded);
	Pt1_capacitors = fill_pt1_capacitors(textFromFileLoaded);
	Pt2_capacitors = fill_p2_capacitors(textFromFileLoaded);
	Farad_capacitors = fill_farad_capacitors(textFromFileLoaded);
	var Qtd_capacitors = Capacitors.length;

	function fill_capacitors(text) {
		var num_C = 0;
		var names = [];
		for (var i = 0; i <= leng; i++) {
			if (text[i] == "C") {
				i++;
				if (text[i] == ":") {
					i++;
					if (text[i] == "C") {
						names[num_C] = text[i]
						i++;
						while (text[i] != " ") {
							names[num_C] += text[i]
							i++;
						}
						num_C++;
					}
				}
			}
		}
		return names;
	}

	function fill_pt1_capacitors(text) {
		var num_pt1 = 0;
		var names_pt1 = [];
		for (var i = 0; i <= leng; i++) {
			if (text[i] == "C") {
				i++;
				if (text[i] == ":") {
					i++;
					if (text[i] == "C") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						names_pt1[num_pt1] = text[i]
						i++;
						while (text[i] != " ") {
							names_pt1[num_pt1] += text[i]
							i++
						}
						num_pt1++
					}
				}
			}
		}
		return names_pt1;
	}

	function fill_p2_capacitors(text) {
		var num_pt2 = 0;
		var names_pt2 = [];
		for (var i = 0; i <= leng; i++) {
			if (text[i] == "C") {
				i++;
				if (text[i] == ":") {
					i++;
					if (text[i] == "C") {
						while (text[i] != " ") {
							i++
						}
						i++
						while (text[i] != " ") {
							i++
						}
						i++
						names_pt2[num_pt2] = text[i]
						i++
						while (text[i] != " ") {
							names_pt2[num_pt2] += text[i]
							i++
						}
						num_pt2++
					}
				}
			}
		}
		return names_pt2;
	}

	function fill_farad_capacitors(text) {
		var faradSI = 0
		var num_C = 0;
		var farad = [];
		for (var i = 0; i <= leng; i++) {
			if (text[i] == "C" && text[i + 1] == "=") {
				i += 3;
				farad[num_C] = text[i]
				i++
				while (text[i] != " " && text[i] !== "\"") {
					farad[num_C] += text[i]
					i++
				}
				i++
				if (text[i] == "F") {
					faradSI = parseInt(farad[num_C])
				} else if (text[i] == "p") {
					faradSI = parseInt(farad[num_C])
					faradSI = faradSI * Math.pow(10, -12)
				} else if (text[i] == "n") {
					faradSI = parseInt(farad[num_C])
					faradSI = faradSI * Math.pow(10, -9)
				} else if (text[i] == "u" || text[i] == "µ") {
					faradSI = parseInt(farad[num_C])
					faradSI = faradSI * Math.pow(10, -6)
				} else if (text[i] == "m") {
					faradSI = parseInt(farad[num_C])
					faradSI = faradSI * Math.pow(10, -3)
				}
				farad[num_C] = faradSI
				num_C++
			}
		}
		return farad;
	}
	//___________________________________________________________//
	//__________________________COILS____________________________//
	var Coils = [];
	var Pt1_coils = [];
	var Pt2_coils = [];
	var Henry_coils = [];
	Coils = fill_coils(textFromFileLoaded);
	Pt1_coils = fill_pt1_coils(textFromFileLoaded);
	Pt2_coils = fill_p2_coils(textFromFileLoaded);
	Henry_coils = fill_henry_coils(textFromFileLoaded);
	var Qtd_coils = Coils.length;

	function fill_coils(text) {
		var num_C = 0;
		var names = [];
		for (var i = 0; i <= leng; i++) {
			if (text[i] == "L") {
				i++;
				if (text[i] == ":") {
					i++;
					names[num_C] = text[i]
					i++;
					while (text[i] != " ") {
						names[num_C] += text[i]
						i++;
					}
					num_C++;
				}
			}
		}
		return names;
	}

	function fill_pt1_coils(text) {
		var num_pt1 = 0;
		var names_pt1 = [];
		for (var i = 0; i <= leng; i++) {
			if (text[i] == "L") {
				i++;
				if (text[i] == ":") {
					i++;
					if (text[i] == "L") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						names_pt1[num_pt1] = text[i]
						i++;
						while (text[i] != " ") {
							names_pt1[num_pt1] += text[i]
							i++
						}
						num_pt1++
					}
				}
			}
		}
		return names_pt1;
	}

	function fill_p2_coils(text) {
		var num_pt2 = 0;
		var names_pt2 = [];
		for (var i = 0; i <= leng; i++) {
			if (text[i] == "L") {
				i++;
				if (text[i] == ":") {
					i++;
					if (text[i] == "L") {
						while (text[i] != " ") {
							i++
						}
						i++
						while (text[i] != " ") {
							i++
						}
						i++
						names_pt2[num_pt2] = text[i]
						i++
						while (text[i] != " ") {
							names_pt2[num_pt2] += text[i]
							i++
						}
						num_pt2++
					}
				}
			}
		}
		return names_pt2;
	}

	function fill_henry_coils(text) {
		var henrySI = 0
		var num_C = 0;
		var henry = [];
		for (var i = 0; i <= leng; i++) {
			if (text[i] == "L" && text[i + 1] == "=") {
				i += 3;
				henry[num_C] = text[i]
				i++
				while (text[i] != " " && text[i] !== "\"") {
					henry[num_C] += text[i]
					i++
				}
				i++
				if (text[i] == "F") {
					henrySI = parseInt(henry[num_C])
				} else if (text[i] == "p") {
					henrySI = parseInt(henry[num_C])
					henrySI = henrySI * Math.pow(10, -12)
				} else if (text[i] == "n") {
					henrySI = parseInt(henry[num_C])
					henrySI = henrySI * Math.pow(10, -9)
				} else if (text[i] == "u" || text[i] == "µ") {
					henrySI = parseInt(henry[num_C])
					henrySI = henrySI * Math.pow(10, -6)
				} else if (text[i] == "m") {
					henrySI = parseInt(henry[num_C])
					henrySI = henrySI * Math.pow(10, -3)
				}
				henry[num_C] = henrySI
				num_C++
			}
		}
		return henry;
	}
	//___________________________________________________________//
	//_________________FONTES DE TENSÃO DC_______________________//
	var Sources_vdc = [];
	var Pt1_vdc = [];
	var Pt2_vdc = [];
	var Volt_vdc = [];
	Sources_vdc = fill_sources_vdc(textFromFileLoaded);
	Pt1_vdc = fill_pt1_vdc(textFromFileLoaded);
	Pt2_vdc = fill_pt2_vdc(textFromFileLoaded);
	Volt_vdc = fill_volt_vdc(textFromFileLoaded);
	var Qtd_sources_vdc = Sources_vdc.length;

	function fill_sources_vdc(text) {
		var i = 0;
		var num_V = 0;
		var nomes = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "V") {
				i++;
				if (text[i] == "d") {
					i++;
					if (text[i] == "c") {
						i++;
						i++;
						nomes[num_V] = text[i];
						i++;
						while (text[i] != " ") {
							nomes[num_V] += text[i];
							i++;
						}
						num_V++;
					}
				}
			}
		}
		return nomes;
	}

	function fill_pt1_vdc(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "V") {
				i++;
				if (text[i] == "d") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						nomes_no[num_no] = text[i];
						i++;
						while (text[i] != " " && text[i] !== "_") {
							nomes_no[num_no] += text[i];
							i++;
							//if(text[i] == "_" && text[i+1] == "T"){
							//	break;
							//}
						}
						num_no++;
					}
				}
			}
		}
		return nomes_no;
	}

	function fill_pt2_vdc(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "V") {
				i++;
				if (text[i] == "d") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						nomes_no[num_no] = text[i];
						i++;
						while (text[i] != " " && text[i] != "\"") {
							nomes_no[num_no] += text[i];
							i++;
						}
						num_no++;
					}
				}
			}
		}
		return nomes_no;
	}

	function fill_volt_vdc(text) {
		var i = 0;
		var num_v = 0;
		var volt = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "U") {
				i++;
				if (text[i] == "=") {
					i++;
					if (text[i] == "\"") {
						i++;
						if (text[i] !== "\"") {
							volt[num_v] = text[i];
							i++;
							while (text[i] != " ") {
								volt[num_v] += text[i];
								i++;
							}
							num_v++;
						}
					}
				}
			}
		}
		return volt;
	}
	//___________________________________________________________//
	//__________________FONTES DE TENSÃO AC______________________//
	var Sources_vac = [];
	var Pt1_vac = [];
	var Pt2_vac = [];
	var Volt_vac = [];
	var circuitFreq = 0;
	Sources_vac = fill_sources_vac(textFromFileLoaded);
	Pt1_vac = fill_pt1_vac(textFromFileLoaded);
	Pt2_vac = fill_pt2_vac(textFromFileLoaded);
	Volt_vac = fill_volt_vac(textFromFileLoaded);
	circuitFreq = fillCircuitFrequency(textFromFileLoaded);
	var Qtd_sources_vac = Sources_vac.length;

	function fill_sources_vac(text) {
		var num_V = 0;
		var nomes = [];
		for (var i = 0; i < leng; i++) {
			if (text[i] == "V") {
				i++;
				if (text[i] == "a") {
					i++;
					if (text[i] == "c") {
						i++;
						if (text[i] == ":") {
							i++;
							nomes[num_V] = text[i];
							i++;
							while (text[i] != " ") {
								nomes[num_V] += text[i];
								i++;
							}
							num_V++;
						}
					}
				}
			}
		}
		return nomes;
	}

	function fill_pt1_vac(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "V") {
				i++;
				if (text[i] == "a") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						nomes_no[num_no] = text[i];
						i++;
						while (text[i] != " ") {
							nomes_no[num_no] += text[i];
							i++;
							if (text[i] == "_" && text[i + 1] == "T") {
								break;
							}
						}
						num_no++;
					}
				}
			}
		}
		return nomes_no;
	}

	function fill_pt2_vac(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "V") {
				i++;
				if (text[i] == "a") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						nomes_no[num_no] = text[i];
						i++;
						while (text[i] != " ") {
							nomes_no[num_no] += text[i];
							i++;
						}
						num_no++;
					}
				}
			}
		}
		return nomes_no;
	}

	function fill_volt_vac(text) {
		var i = 0;
		var num_v = 0;
		var volt = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "V") {
				i++;
				if (text[i] == "a") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						if (text[i] == "U") {
							i++;
							if (text[i] == "=") {
								i++;
								if (text[i] == "\"") {
									i++;
									volt[num_v] = text[i];
									i++;
									while (text[i] != " ") {
										volt[num_v] += text[i];
										i++;
									}
									num_v++;
								}
							}
						}
					}
				}
			}
		}
		return volt;
	}

	function fillCircuitFrequency(text) {
		var i = 0;
		var freq = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "V") {
				i++;
				if (text[i] == "a") {
					i++;
					if (text[i] == "c") {
						while (text[i] != "f") {
							i++;
						}
						if (text[i] == "f") {
							i++;
							if (text[i] == "=") {
								i++;
								i++;
								if (text[i] !== "\"") {
									freq = text[i];
									i++;
									while (text[i] != " ") {
										freq += text[i];
										i++;
									}
									i++;
									freq = parseInt(freq)
									if (text[i] == "H") {
										return freq;
									} else if (text[i] == "k" || text[i] == "K") {
										return freq * Math.pow(10, 3);
									} else if (text[i] == "M") {
										return freq * Math.pow(10, 6);
									} else if (text[i] == "G") {
										return freq * Math.pow(10, 9);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	//___________________________________________________________//
	//_________________CURRENT SOURCES DC________________________//
	var Sources_idc = [];
	var Pt1_idc = [];
	var Pt2_idc = [];
	var Ampere_idc = [];
	Sources_idc = fill_sources_idc(textFromFileLoaded);
	Pt1_idc = fill_pt1_idc(textFromFileLoaded);
	Pt2_idc = fill_pt2_idc(textFromFileLoaded);
	Ampere_idc = fill_ampere_idc(textFromFileLoaded);
	var Qtd_fontes_idc = Sources_idc.length;

	function fill_sources_idc(text) {
		var i = 0;
		var num_I = 0;
		var nomes = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "d") {
					i++;
					if (text[i] == "c") {
						i++;
						i++;
						nomes[num_I] = text[i];
						i++;
						while (text[i] != " ") {
							nomes[num_I] += text[i];
							i++;
						}
						num_I++;
					}
				}
			}
		}
		return nomes;
	}

	function fill_pt1_idc(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "d") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						nomes_no[num_no] = text[i];
						i++;
						while (text[i] != " ") {
							nomes_no[num_no] += text[i];
							i++;
						}
						num_no++;
					}
				}
			}
		}
		return nomes_no;
	}

	function fill_pt2_idc(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "d") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						nomes_no[num_no] = text[i];
						i++;
						while (text[i] != " ") {
							nomes_no[num_no] += text[i];
							i++;
						}
						num_no++;
					}
				}
			}
		}
		return nomes_no;
	}

	function fill_ampere_idc(text) {
		var i = 0;
		var num_I = 0;
		var ampere = [];
		var ampereSI = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "d") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						if (text[i] == "I") {
							i++;
							if (text[i] == "=") {
								i++;
								i++;
								if (text[i] !== "\"") {
									ampere[num_I] = text[i];
									i++;
									while (text[i] != " ") {
										ampere[num_I] += text[i];
										i++;
									}
									i++;
									if (text[i] == "A") {
										ampereSI = parseInt(ampere[num_I])
									} else if (text[i] == "m") {
										ampereSI = parseInt(ampere[num_I])
										ampereSI = ampereSI * Math.pow(10, -3)
									}
									ampere[num_I] = ampereSI;
									num_I++;
								}
							}
						}
					}
				}
			}
		}
		return ampere;
	}
	//___________________________________________________________//
	//_________________FONTES DE CORRENTE AC_____________________//
	var CurrentSources_iac = [];
	var Pt1_iac = [];
	var Pt2_iac = [];
	var Ampere_iac = [];
	CurrentSources_iac = fill_currentSources_iac(textFromFileLoaded);
	Pt1_iac = fill_pt1_iac(textFromFileLoaded);
	Pt2_iac = fill_pt2_iac(textFromFileLoaded);
	Ampere_iac = fill_ampere_iac(textFromFileLoaded);
	var Qtd_CurrentSources_iac = CurrentSources_iac.length;

	function fill_currentSources_iac(text) {
		var i = 0;
		var num_I = 0;
		var nomes = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "a") {
					i++;
					if (text[i] == "c") {
						i++;
						i++;
						nomes[num_I] = text[i];
						i++;
						while (text[i] != " ") {
							nomes[num_I] += text[i];
							i++;
						}
						num_I++;
					}
				}
			}
		}
		return nomes;
	}

	function fill_pt1_iac(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "a") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						nomes_no[num_no] = text[i];
						i++;
						while (text[i] != " ") {
							nomes_no[num_no] += text[i];
							i++;
						}
						num_no++;
					}
				}
			}
		}
		return nomes_no;
	}

	function fill_pt2_iac(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "a") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						nomes_no[num_no] = text[i];
						i++;
						while (text[i] != " ") {
							nomes_no[num_no] += text[i];
							i++;
						}
						num_no++;
					}
				}
			}
		}
		return nomes_no;
	}

	function fill_ampere_iac(text) {
		var i = 0;
		var num_I = 0;
		var ampere = [];
		for (i = 0; i < leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "a") {
					i++;
					if (text[i] == "c") {
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						while (text[i] != " ") {
							i++;
						}
						i++;
						if (text[i] == "I") {
							i++;
							if (text[i] == "=") {
								i++;
								i++;
								if (text[i] !== "\"") {
									ampere[num_I] = text[i];
									i++;
									while (text[i] != " ") {
										ampere[num_I] += text[i];
										i++;
									}
									num_I++;
								}
							}
						}
					}
				}
			}
		}
		return ampere;
	}
	//___________________________________________________________//
	//______________________AMPERIMETROS_________________________//
	var Amperimetros = [];
	var No1_amperimetro = [];
	var No2_amperimetro = [];
	Amperimetros = fill_amperimetros(textFromFileLoaded);
	No1_amperimetro = fill_no1_amperimetro(textFromFileLoaded);
	No2_amperimetro = fill_no2_amperimetro(textFromFileLoaded);
	var Qtd_amperimetros = Amperimetros.length;

	function fill_amperimetros(text) {
		var i = 0;
		var num_amp = 0;
		var nomes = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "P") {
					i++;
					if (text[i] == "r") {
						i++;
						if (text[i] == "o") {
							while (text[i] != ":") {
								i++;
							}
							i++;
							nomes[num_amp] = text[i];
							while (text[i] != " ") {
								i++;
								nomes[num_amp] += text[i];
							}
							num_amp++;
						}
					}
				}
			}
		}
		return nomes;
	}

	function fill_no1_amperimetro(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "P") {
					i++;
					if (text[i] == "r") {
						i++;
						if (text[i] == "o") {
							while (text[i] != ":") {
								i++;
							}
							i++;
							while (text[i] != " ") {
								i++;
							}
							i++;
							nomes_no[num_no] = text[i];
							while (text[i] != " ") {
								i++;
								if (text[i] != " ") {
									nomes_no[num_no] += text[i];
								}
							}
							num_no++;
						}
					}
				}
			}
		}
		return nomes_no;
	}

	function fill_no2_amperimetro(text) {
		var i = 0;
		var num_no = 0;
		var nomes_no = [];
		for (i = 0; i <= leng; i++) {
			if (text[i] == "I") {
				i++;
				if (text[i] == "P") {
					i++;
					if (text[i] == "r") {
						i++;
						if (text[i] == "o") {
							while (text[i] != ":") {
								i++;
							}
							i++;
							while (text[i] != " ") {
								i++;
							}
							i++;
							while (text[i] != " ") {
								i++;
							}
							i++;
							nomes_no[num_no] = text[i];
							i++;
							while (text[i] != "\n" && text[i] != "_") {
								if (text[i] != " ") {
									nomes_no[num_no] += text[i];
								}
								i++;
							}
							num_no++;
						}
					}
				}
			}
		}
		return nomes_no;
	}
	//___________________________________________________________//
	//______________CRIAR MATRIZ DE COMPONENTES__________________//
	var matriz = fill_matriz();

	function fill_matriz() {
		var k = 0;
		var m = 0;
		var w = 0;
		var matriz = [4];
		var Qtd_elementos = Qtd_resistors + Qtd_sources_vdc + Qtd_fontes_idc + Qtd_amperimetros + Qtd_capacitors + Qtd_coils + Qtd_CurrentSources_iac + Qtd_sources_vac;
		for (k = 0; k < 4; k++) {
			matriz[k] = [Qtd_elementos];
		}
		while (m < Qtd_resistors) {
			matriz[0][m] = Resistors[m];
			matriz[1][m] = Pt1_resistors[m];
			matriz[2][m] = Pt2_resistors[m];
			matriz[3][m] = Ohm_resistors[m];
			m++;
		}
		while (w < Qtd_capacitors) {
			matriz[0][m + w] = Capacitors[w];
			matriz[1][m + w] = Pt1_capacitors[w];
			matriz[2][m + w] = Pt2_capacitors[w];
			matriz[3][m + w] = Farad_capacitors[w];
			w++;
		}
		m += w
		w = 0;
		while (w < Qtd_coils) {
			matriz[0][m + w] = Coils[w];
			matriz[1][m + w] = Pt1_coils[w];
			matriz[2][m + w] = Pt2_coils[w];
			matriz[3][m + w] = Henry_coils[w];
			w++;
		}
		m += w
		w = 0;
		while (w < Qtd_sources_vdc) {
			matriz[0][m + w] = Sources_vdc[w];
			matriz[1][m + w] = Pt1_vdc[w];
			matriz[2][m + w] = Pt2_vdc[w];
			matriz[3][m + w] = Volt_vdc[w];
			w++;
		}
		m += w
		w = 0;
		while (w < Qtd_fontes_idc) {
			matriz[0][m + w] = Sources_idc[w];
			matriz[1][m + w] = Pt1_idc[w];
			matriz[2][m + w] = Pt2_idc[w];
			matriz[3][m + w] = Ampere_idc[w];
			w++;
		}
		m += w
		w = 0;
		while (w < Qtd_sources_vac) {
			matriz[0][m + w] = Sources_vac[w];
			matriz[1][m + w] = Pt1_vac[w];
			matriz[2][m + w] = Pt2_vac[w];
			matriz[3][m + w] = Volt_vac[w];
			w++;
		}
		m += w
		w = 0;
		while (w < Qtd_CurrentSources_iac) {
			matriz[0][m + w] = CurrentSources_iac[w];
			matriz[1][m + w] = Pt1_iac[w];
			matriz[2][m + w] = Pt2_iac[w];
			matriz[3][m + w] = Ampere_iac[w];
			w++;
		}
		m += w
		w = 0;
		while (w < Qtd_amperimetros) {
			matriz[0][m + w] = Amperimetros[w];
			matriz[1][m + w] = No1_amperimetro[w];
			matriz[2][m + w] = No2_amperimetro[w];
			matriz[3][m + w] = "AMP";
			w++;
		}
		return matriz;
	}
	//___________________________________________________________//
	function combinations(arr, k) {
		var i,
			subI,
			ret = [],
			sub,
			next;
		for (i = 0; i < arr.length; i++) {
			if (k === 1) {
				ret.push([arr[i]]);
			} else {
				sub = combinations(arr.slice(i + 1, arr.length), k - 1);
				for (subI = 0; subI < sub.length; subI++) {
					next = sub[subI];
					next.unshift(arr[i]);
					ret.push(next);
				}
			}
		}
		return ret;
	}
	var permutationsWithRepetition = function(n, as) {
		return as.length > 0 ? (foldl1(curry(cartesianProduct)(as), replicate(n, as))) : [];
	};
	var cartesianProduct = function(xs, ys) {
		return [].concat.apply([], xs.map(function(x) {
			return [].concat.apply([], ys.map(function(y) {
				return [
					[x].concat(y)
				];
			}));
		}));
	};
	var foldl1 = function(f, xs) {
		return xs.length > 0 ? xs.slice(1).reduce(f, xs[0]) : [];
	};
	var replicate = function(n, a) {
		var v = [a],
			o = [];
		if (n < 1) return o;
		while (n > 1) {
			if (n & 1) o = o.concat(v);
			n >>= 1;
			v = v.concat(v);
		}
		return o.concat(v);
	};
	var curry = function(f) {
		return function(a) {
			return function(b) {
				return f(a, b);
			};
		};
	};

	function allCombinations(numNos, vetorRamos) {
		for (var i = 2; i <= numNos; i++) {
			var aux = combinations(vetor_ramos_numeros, i)
			perm = perm.concat(aux)
			aux = [];
		}
		if (numNos < 6) {
			for (i = 4; i <= numNos; i++) {
				aux = permutationsWithRepetition(i, vetorRamos)
				perm = perm.concat(aux)
				aux = [];
			}
		} else {
			for (i = 4; i < 6; i++) {
				aux = permutationsWithRepetition(i, vetorRamos)
				perm = perm.concat(aux)
				aux = [];
			}
			for (i = 4; i <= 5; i++) {
				aux = permutationsWithRepetition(i, arrBranchesWithoutCurrentSources)
				perm = perm.concat(aux)
				aux = [];
			}
		}
	}
	console.log(matriz)
	//_________________CRIAR TABELA INVERTIDA____________________//
	function fill_tabela(matriz) {
		var x = 0;
		var y = 0;
		var tabela = "<table border=10>";
		var n_colunas = matriz[0].length;
		var n_linhas = matriz.length;
		for (x = 0; x < n_colunas; x++) {
			tabela += "<tr>";
			for (y = 0; y < n_linhas; y++) {
				tabela += "<td style='width: 90px; color: black; text-align: center;'>" + "[" + y + "]" + "[" + x + "] " + matriz[y][x] + "</td>";
				//tabela += "<td style='width: 90px; color: black; text-align: center;'>" + matriz[y][x] + "</td>";
			}
			tabela += "</tr>";
		}
		tabela += "</table>";
		return tabela;
	}
	//___________________________________________________________//
	//__________________FILTRAR AMPERIMETROS_____________________//
	filtrar_amperimetros();

	function filtrar_amperimetros() {
		var i = 0;
		var k = 0;
		var linha_amp; // Guardar linha em que se encontra o amperimetro
		var no_a_remover; // Guardar nó a remover da matriz
		var no_a_substituir; // Guardar nó a substituir noutro componente da matriz
		var coluna_nos = 1; // Alterará entre o valor 1 e 2 (colunas da matriz com os nos existentes)
		var vetor_remove = [];
		var indice_vetor_remove = 0;
		for (i = 0; i < matriz[3].length; i++) {
			if (matriz[3][i] == "AMP") {
				linha_amp = i;
				if (matriz[1][i] != "gnd") {
					no_a_remover = matriz[1][i];
					no_a_substituir = matriz[2][i];
				} else {
					no_a_remover = matriz[2][i];
					no_a_substituir = matriz[1][i];
				}
				for (coluna_nos = 1; coluna_nos < 3; coluna_nos++) {
					while ((k < matriz[coluna_nos].length)) {
						if ((matriz[coluna_nos][k] == no_a_remover) && (k != linha_amp)) {
							matriz[coluna_nos][k] = no_a_substituir;
						}
						k++;
					}
					k = 0;
				}
				vetor_remove[indice_vetor_remove] = i;
				indice_vetor_remove++;
			}
		}
		var m = 0;
		var indice_removidos = vetor_remove[m];
		for (m = 0; m < vetor_remove.length; m++) {
			matriz[0].splice(indice_removidos, 1);
			matriz[1].splice(indice_removidos, 1);
			matriz[2].splice(indice_removidos, 1);
			matriz[3].splice(indice_removidos, 1);
		}
	}
	console.table(matriz)
	//___________________________________________________________//
	//_____________________CALCULAR NOS__________________________//
	var vetor_nos = [];
	var vetor_ocorrencias = [];
	var num_nos = 0;
	var vetor_nos_reais = [];
	var vetor_nos_virtuais = [];
	var flagError = 0;
	var flagMissGND = 0;
	var errorStr = `Identification errors:\n`
	calcular_ocorrencia_de_nos();

	function calcular_ocorrencia_de_nos() {
		var n = 1;
		var i = 0;
		var nos_detetados = [];
		var nos_ocorrencias = new Array(150).fill(0);
		for (n = 1; n < 3; n++) {
			var linha_matriz = 0;
			var no_ja_existente = 0;
			while (linha_matriz < matriz[n].length) {
				for (i = 0; i < nos_detetados.length; i++) {
					if (matriz[n][linha_matriz] == nos_detetados[i]) {
						nos_ocorrencias[i] += 1;
						no_ja_existente = 1;
					}
				}
				if (no_ja_existente == 1) {
					no_ja_existente = 0;
					linha_matriz++;
				} else {
					nos_detetados[nos_detetados.length] = matriz[n][linha_matriz];
					nos_ocorrencias[nos_detetados.length] += 1;
					linha_matriz++;
				}
			}
		}
		var m = 0;
		while (nos_ocorrencias[m] != 0) {
			m++;
		}
		nos_ocorrencias[0] = nos_ocorrencias[0] + nos_ocorrencias[m - 1];
		nos_ocorrencias[m - 1] = 0;
		m = 0;
		while (nos_ocorrencias[m] != 0) {
			vetor_ocorrencias[m] = nos_ocorrencias[m];
			m++;
		}
		vetor_nos = nos_detetados;
		calcular_nos_reais();
	}
	console.log(matriz)
	//console.log(nos_ocorrencias,"nos ocorrencias")
	console.log(vetor_ocorrencias, "vetor ocorrencias")
	console.log(vetor_nos)

	function calcular_nos_reais() {
		var i = 0;
		var real_cnt = 0;
		var virt_cnt = 0;
		while (i < vetor_ocorrencias.length) {
			if (vetor_ocorrencias[i] > 2) {
				vetor_nos_reais[real_cnt] = vetor_nos[i];
				real_cnt++;
			}
			if (vetor_ocorrencias[i] < 3) {
				vetor_nos_virtuais[virt_cnt] = vetor_nos[i];
				virt_cnt++;
			}
			i++;
		}
		num_nos = vetor_nos_reais.length;
		for (let i in vetor_nos_reais) {
			if (vetor_nos_reais[i].includes("_net") == true) {
				flagError = 1;
				errorStr += `Node ${vetor_nos_reais[i]} not correctly identified!\n`
			}
			if (vetor_nos_reais[i].includes("gnd") == true) {
				flagMissGND = 1;
			}
		}
		for (let i in vetor_nos_virtuais) {
			if (vetor_nos_virtuais[i].includes("gnd") == true) {
				flagMissGND = 1;
			}
		}
		if (flagMissGND == 0) {
			flagError = 1
			errorStr += `Ground not identified!\n`
		}
	}

	function validar_no(pos) {
		var i = 0;
		while (i < vetor_nos_reais.length) {
			if (vetor_nos_reais[i] == pos) {
				return 1;
			}
			i++;
		}
		return 0;
		//Retorna 1 se a posição recebida corresponder a um nó real
		//Retorna 0 se a posiçao recebida corresponder a um ponto intermedio de um qualquer ramo
	}
	//___________________________________________________________//
	//_____________________CALCULAR RAMOS________________________//
	var linhas_matriz = matriz[0].length;
	//var colunas_matriz = matriz.length; // Sempre "4"
	var ramos_comp = [];
	var ramos_coord = [];
	var branchesAbsoluteCoord = []
	var arrCurrentSourcesBranches = []
	var arrCurrentSourcesLines = []
	var num_CurrentSources = 0
	var num_componentes = 0;
	var num_ramos = 0;
	calcular_ramos();

	function calcular_ramos() {
		var i = 0;
		var no_inicial = "";
		var comp_analizados = [];
		var num_comp_analizados = 0;
		var coluna = 1;
		var linha = 0;
		var vetor_aux = [];
		while (i < 10) {
			linha = 0;
			coluna = trocar_coluna(coluna);
			while (linha < linhas_matriz) {
				if ((validar_no(matriz[coluna][linha]) == 1) && (comp_analizados.indexOf(linha) == -1)) {
					num_componentes = 0;
					ramos_comp[num_ramos] = [];
					ramos_comp[num_ramos][num_componentes] = linha;
					if (matriz[0][linha].includes("I") == true) {
						arrCurrentSourcesBranches.push(num_ramos)
						arrCurrentSourcesLines.push(linha)
					}
					ramos_coord[num_ramos] = [];
					ramos_coord[num_ramos][0] = matriz[coluna][linha];
					branchesAbsoluteCoord[num_ramos] = [];
					branchesAbsoluteCoord[num_ramos].push(matriz[coluna][linha])
					if (coluna == 1) {
						branchesAbsoluteCoord[num_ramos].push(matriz[2][linha])
					} else {
						branchesAbsoluteCoord[num_ramos].push(matriz[1][linha])
					}
					num_componentes++;
					coluna = trocar_coluna(coluna);
					comp_analizados[num_comp_analizados] = linha;
					num_comp_analizados++;
					while ((validar_no(matriz[coluna][linha]) != 1)) {
						no_inicial = matriz[coluna][linha];
						vetor_aux = encontrar_ponto_comum(no_inicial, comp_analizados);
						coluna = vetor_aux[1];
						linha = vetor_aux[0];
						ramos_comp[num_ramos][num_componentes] = linha;
						num_componentes++;
						if (matriz[0][linha].includes("I") == true) {
							arrCurrentSourcesBranches.push(num_ramos)
						}
						branchesAbsoluteCoord[num_ramos].push(matriz[coluna][linha])
						if (coluna == 1) {
							branchesAbsoluteCoord[num_ramos].push(matriz[2][linha])
						} else {
							branchesAbsoluteCoord[num_ramos].push(matriz[1][linha])
						}
						comp_analizados[num_comp_analizados] = vetor_aux[0];
						num_comp_analizados++;
						coluna = trocar_coluna(coluna);
					}
					ramos_coord[num_ramos][1] = matriz[coluna][linha];
					num_ramos++;
				}
				linha++;
			}
			i++;
		}
		num_CurrentSources = arrCurrentSourcesBranches.length
		return num_ramos;
	}
	console.log(vetor_nos_reais, "vetor nos reais")
	//___________________________________________________________//
	//____________________CALCULAR MALHAS________________________//
	//------------------------------------------------------//
	//Cria N vetores com o numero da malha correspondente ao nó//
	var groupArray = [];
	agroupBranchesNodes();
	console.log(matriz, "teste")
	console.log(vetor_nos_reais, "jbal")

	function agroupBranchesNodes() {
		var i = 0;
		var j = 0;
		for (i = 0; i < num_nos; i++) {
			groupArray[i] = [];
			for (j = 0; j < num_ramos; j++) {
				if (ramos_coord[j][0] == vetor_nos_reais[i] || ramos_coord[j][1] == vetor_nos_reais[i]) {
					groupArray[i].push(j);
				}
			}
		}
	}
	var QtdMalhas = 0;
	QtdMalhas = num_ramos - (num_nos - 1) - num_CurrentSources;
	//--------------//
	var mesh = [];
	var meshForCurrentSources = []
	var num_malhas = 0;
	var vetor_ramos_numeros = []
	numeros_ramos()

	function numeros_ramos() {
		var i = 0;
		for (i = 0; i < num_ramos; i++) {
			vetor_ramos_numeros[i] = i;
		}
	}
	//var arrBranchesWithoutCurrentSources = []
	//branchesWithoutCurrentSources()
	function branchesWithoutCurrentSources() {
		var i = 0;
		for (i = 0; i < num_ramos; i++) {
			if (arrCurrentSourcesBranches.includes(i) == false) {
				arrBranchesWithoutCurrentSources[arrBranchesWithoutCurrentSources.length] = i;
			}
		}
	}

	function nos_do_ramo(ramo) {
		//função que devolve nós do ramo
		var nos = [];
		for (var i = 0; i < groupArray.length; i++) {
			if (groupArray[i].includes(ramo) === true) {
				nos = nos + i
			}
		}
		return nos;
	}

	function teste_1(combinacao) {
		//verifica se primeiro e último ramo têem 1,2 ou nenhum nó em comum
		var nos_primeiro; //nos do primeiro ramo
		nos_primeiro = nos_do_ramo(combinacao[0]); //envia primeiro ramo da malha
		var nos_ultimo; //nos do ultimo ramo
		nos_ultimo = nos_do_ramo(combinacao[combinacao.length - 1]); //envia ultimo ramo da malha
		var numero_nos_comum = 0;
		if (nos_primeiro.includes(nos_ultimo[0]) === true) {
			numero_nos_comum += 1;
		}
		if (nos_primeiro.includes(nos_ultimo[1]) === true) {
			numero_nos_comum += 1;
		}
		return numero_nos_comum;
	}

	function intersect(nos_ramo1, nos_ramo2) {
		if (nos_ramo1.includes(nos_ramo2[0]) === true) {
			return nos_ramo2[0];
		}
		if (nos_ramo1.includes(nos_ramo2[1]) === true) {
			return nos_ramo2[1];
		} else return -1;
	}
	var todasMalhas = [];
	var maxPossibleMeshes = todasMalhas.length
	var perm = [];
	var arrBranchesWithoutCurrentSources = []
	branchesWithoutCurrentSources()
	allCombinations(num_nos, vetor_ramos_numeros)
	testa_malha(perm);
	console.log(perm, "muye")

	function testa_malha() {
		var nos_comum = [];
		var nos_caminho = [];
		var combinacoes = perm
		var nos_ramo_atual;
		var nos_ramo_seguinte;
		var no_comum;
		for (var i = 0; i < combinacoes.length; i++) {
			nos_comum = teste_1(combinacoes[i]);
			if (combinacoes[i].length == 2 && nos_comum == 2 && combinacoes[i][0] != combinacoes[i][1]) {
				todasMalhas.push(combinacoes[i])
				/*
						if (blackList.indexOf(combinacoes[i][0]) == -1 && doNotRepeatBranchesMoreThanTwoTimes(combinacoes[i]) == 1) {
						mesh[num_malhas] = [];
						mesh[num_malhas] = combinacoes[i]
						num_malhas++;

						adicionaGreyList(combinacoes[i])
						}
				*/
			} else {
				nos_caminho = [];
				for (var j = 0; j < combinacoes[i].length; j++) {
					if (j < combinacoes[i].length - 1) //se ainda não tiver chegado ao último nó
					{
						nos_ramo_atual = nos_do_ramo(combinacoes[i][j]);
						nos_ramo_seguinte = nos_do_ramo(combinacoes[i][j + 1]);
						no_comum = intersect(nos_ramo_atual, nos_ramo_seguinte)
						if (no_comum === -1) {
							break;
						}
						if (nos_caminho.includes(no_comum) === false) //se não incluir adiciona
						{
							if (j > 0) {
								nos_caminho.push(no_comum)
							}
							if (j === 0) {
								nos_caminho[j + 1] = nos_caminho + no_comum;
								if (nos_caminho.includes(nos_ramo_atual[0]) === false) {
									nos_caminho[0] = nos_ramo_atual[0]
								} else nos_caminho[0] = nos_ramo_atual[1]
							}
						} else if (nos_caminho.includes(no_comum) === true) {
							if (j != combinacoes[i].length - 1) {
								break;
							}
						}
					}
					if (j == combinacoes[i].length - 1) {
						nos_ramo_atual = nos_do_ramo(combinacoes[i][j]);
						nos_ramo_seguinte = nos_do_ramo(combinacoes[i][0]);
						no_comum = intersect(nos_ramo_atual, nos_ramo_seguinte);
						if (no_comum == nos_caminho[0]) {
							todasMalhas.push(combinacoes[i])
						}
					}
				}
			}
		}
	}
	apagar_repetidos();

	function apagar_repetidos() {
		for (var i = 0; i < todasMalhas.length; i++) {
			for (var j = 0; j < todasMalhas.length; j++) {
				var array1 = todasMalhas[i]
				var array2 = todasMalhas[j]
				if (i !== j && todasMalhas[i].length > 3 && todasMalhas[j].length > 3 && array1.length === array2.length) {
					var array11 = array1.slice()
					var array22 = array2.slice()
					array11.sort()
					array22.sort()
					if (JSON.stringify(array11) === JSON.stringify(array22)) {
						todasMalhas.splice(j, 1)
						j--
					}
				}
			}
		}
		maxPossibleMeshes = todasMalhas.length
	}
	// ----------------------------------------------------------- //
	// Repetir a operação para garantir a melhor escolha de malhas
	num_malhas = 0;
	mesh = [];
	var meshCurrentSources = [];
	todasMalhas = []
	var UsedBranches = []
	var notUsed = []
	testa_malha(todasMalhas);
	apagar_repetidos();
	filterMeshesWithCurrentSources();

	function filterMeshesWithCurrentSources() {
		for (var i = todasMalhas.length - 1; i >= 0; --i) {
			for (var j = 0; j < num_CurrentSources; j++) {
				if (todasMalhas[i].includes(arrCurrentSourcesBranches[j]) == true) {
					meshForCurrentSources.push(todasMalhas[i])
					todasMalhas.splice(i, 1)
					j = num_CurrentSources
				}
			}
		}
		meshForCurrentSources.sort(function(a, b) {
			return a.length - b.length
		})
		if (arrCurrentSourcesBranches.length == 1) {
			var contComp = 0;
			var meshWithLessComps = 0;
			for (i = 0; i < meshForCurrentSources.length; i++) {
				var contAux = 0;
				for (j = 0; j < meshForCurrentSources[i].length; j++) {
					var brancheAux = meshForCurrentSources[i][j]
					contAux += ramos_comp[brancheAux].length
				}
				if (i !== 0) {
					if (contAux < contComp) {
						contComp = contAux;
						meshWithLessComps = i;
					}
				} else {
					contComp = contAux;
					meshWithLessComps = i
				}
			}
			meshForCurrentSources.splice(0, 0, meshForCurrentSources[meshWithLessComps])
			meshForCurrentSources.splice(1, meshForCurrentSources.length - 1)
		}
	}
	chooseMeshes();

	function chooseMeshes() {
		mesh = []
		todasMalhas.reverse();
		for (var i = 0; i < num_ramos; i++) {
			for (var j = todasMalhas.length - 1; j >= 0; j--) {
				if (todasMalhas[j].includes(i) == true) {
					mesh.push(todasMalhas[j])
					todasMalhas.splice(j, 1)
					break;
				}
			}
		}
		console.log(mesh, "lol")
		var flag_todos_ramos = 0
		console.log(mesh)
		while (flag_todos_ramos == 0 && mesh.length >= 1) {
			var meshAux = mesh.slice()
			shuffle(meshAux)
			meshAux.splice(QtdMalhas, meshAux.length - QtdMalhas)
			if (allBranchesUsed(meshAux) == 1) {
				mesh = meshAux
				num_malhas = mesh.length
				flag_todos_ramos = 1
			} else {
				flag_todos_ramos = 0
			}
		}
	}

	function allBranchesUsed(mesh) {
		UsedBranches = []
		notUsed = []
		for (var i = 0; i < QtdMalhas; i++) {
			for (var j = 0; j < mesh[i].length; j++) {
				if (UsedBranches.includes(mesh[i][j]) == false) {
					UsedBranches.push(mesh[i][j])
					//document.write("Mesh legnth:",mesh.length,QtdMalhas,"||",mesh[0],"||",mesh[1],"||",mesh[2],"||",mesh[3],"||",mesh[4],"||",mesh[5])
				}
			}
		}
		for (var k = 0; k < num_ramos; k++) {
			if (UsedBranches.includes(k) == false) {
				if (arrCurrentSourcesBranches.includes(k) == false) {
					notUsed.push(k)
				}
			}
		}
		verifyMeshesCompability()
		if (notUsed.length == 0) {
			return 1
		} else {
			return -1
		}
	}

	function verifyMeshesCompability() {
		for (var i = 0; i < mesh.length; i++) {
			var branchesUsedAux = []
			var flag_notUsed = 0
			for (var aux = 0; aux < mesh.length; aux++) {
				if (i !== aux) {
					//branchesUsedAux.push(...mesh[aux])
					//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					for (var run = 0; run < mesh[aux].length; run++) {
						branchesUsedAux.push(mesh[aux][run])
					}
				}
			}
			for (var k = 0; k < mesh[i].length; k++) {
				if (branchesUsedAux.includes(mesh[i][k]) == false) {
					flag_notUsed++
				} else if (branchesUsedAux.includes(mesh[i][k]) == true) {
					break;
				}
			}
			if (flag_notUsed == mesh[i].length) {
				chooseMeshes();
			}
		}
	}

	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
	//addCurrentSourceMeshes();
	function addCurrentSourceMeshes() {
		for (var i = 0; i < num_CurrentSources; i++) {
			for (var j = 0; j < num_CurrentSources; j++) {
				if (meshForCurrentSources[i].includes(arrCurrentSourcesBranches[j]) == true) {
					var tam = meshCurrentSources.length
					meshCurrentSources.splice(tam, 0, meshForCurrentSources[i])
				}
			}
		}
		tam = meshCurrentSources.length
		for (i = 0; i < tam; i++) {
			mesh.splice(i, 0, meshCurrentSources[i])
		}
	}
	console.log(branchesAbsoluteCoord, "absolute")
	console.log(ramos_coord, "coord")
	// ----------------------------------------------------------- //
	// ----------------------------------------------------------- //
	var meshComps = []
	var compOnMeshesArr = []
	var compOnBranchesArr = []
	var current = [];
	var current_path = [];
	var current_path_without_duplicates = []
	var currentWithoutNet = []
	var branchesWithoutCSource = [];
	console.log(ramos_comp)
	criar_correntes_para_malhas();

	function criar_correntes_para_malhas() {
		for (var i = 0; i < num_malhas; i++) {
			current.push("i" + i)
		}
	}
	criar_sentidos_para_correntes();

	function criar_sentidos_para_correntes() {
		for (var i = 0; i < current.length; i++) {
			current_path[i] = [];
			meshComps[i] = []
			for (var j = 0; j < mesh[i].length; j++) {
				var ramo_auxilio = mesh[i][j];
				//console.log(ramos_comp[ramo_auxilio])
				var ramo_caminho = branchesAbsoluteCoord[ramo_auxilio]
				var ramo_comp = ramos_comp[ramo_auxilio]
				var auxRev = ramo_caminho.slice()
				auxRev.reverse()
				var auxRevComp = ramo_comp.slice()
				auxRevComp.reverse()
				if (j == 0) {
					for (var run = 0; run < ramo_caminho.length; run++) {
						current_path[i].push(ramo_caminho[run])
					}
					//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					//current_path[i].push(...ramo_caminho)
					if (matriz[1][ramo_comp[0]] == current_path[i][0] || matriz[2][ramo_comp[0]] == current_path[i][0]) {
						//meshComps[i].push(...ramo_comp)
						for (run = 0; run < ramo_comp.length; run++) {
							meshComps[i].push(ramo_comp[run])
						}
					} else {
						//meshComps[i].push(...auxRevComp)
						for (run = 0; run < auxRevComp.length; run++) {
							meshComps[i].push(auxRevComp[run])
						}
					}
				}
				if (j != 0) {
					if (ramo_caminho[0] == current_path[i][current_path[i].length - 1]) {
						//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
						//current_path[i].push(...ramo_caminho)
						//meshComps[i].push(...ramo_comp)
						for (run = 0; run < ramo_caminho.length; run++) {
							current_path[i].push(ramo_caminho[run])
						}
						for (run = 0; run < ramo_comp.length; run++) {
							meshComps[i].push(ramo_comp[run])
						}
					} else if (ramo_caminho[ramo_caminho.length - 1] == current_path[i][current_path[i].length - 1]) {
						//current_path[i].push(...auxRev)
						//meshComps[i].push(...auxRevComp)
						for (run = 0; run < auxRev.length; run++) {
							current_path[i].push(auxRev[run])
						}
						for (run = 0; run < auxRevComp.length; run++) {
							meshComps[i].push(auxRevComp[run])
						}
					} else {
						//Se a ordem do primeiro ramo não é compativel com a ordem da malha
						var path_rev = current_path[i].slice()
						path_rev.reverse()
						current_path[i] = path_rev
						var comp_rev = meshComps[i].slice()
						comp_rev.reverse()
						meshComps[i] = comp_rev
						if (ramo_caminho[0] == current_path[i][current_path[i].length - 1]) {
							for (run = 0; run < ramo_caminho.length; run++) {
								current_path[i].push(ramo_caminho[run])
							}
							for (run = 0; run < ramo_comp.length; run++) {
								meshComps[i].push(ramo_comp[run])
							}
							//current_path[i].push(...ramo_caminho)
							//meshComps[i].push(...ramo_comp)
						} else if (ramo_caminho[ramo_caminho.length - 1] == current_path[i][current_path[i].length - 1]) {
							for (run = 0; run < auxRev.length; run++) {
								current_path[i].push(auxRev[run])
							}
							for (run = 0; run < auxRevComp.length; run++) {
								meshComps[i].push(auxRevComp[run])
							}
							//current_path[i].push(...auxRev)
							//meshComps[i].push(...auxRevComp)
						}
					}
				}
			}
		}
		for (var k = 0; k < current_path.length; k++) {
			current_path_without_duplicates[k] = remove_duplicates_es6(current_path[k])
		}
		console.log(current_path)
		currentWithoutNet = current_path_without_duplicates.slice()
		for (var m = 0; m < currentWithoutNet.length; m++) {
			for (var p = 0; p < currentWithoutNet[m].length; p++) {
				if (currentWithoutNet[m][p].includes("_net") == true) {
					currentWithoutNet[m].splice(p, 1)
				}
			}
		}
	}

	function remove_duplicates_es6(arr) {
		var s = new Set(arr);
		var it = s.values();
		return Array.from(it);
	}

	function componentOrderFix(meshID) {
		var comp = []
		compOnMeshesArr[meshID] = []
		for (var i = 0; i < meshComps[meshID].length; i++) {
			comp.push(matriz[0][meshComps[meshID][i]])
			compOnMeshesArr[meshID].push(matriz[0][meshComps[meshID][i]])
		}
		return comp
	}
	for (var correr_caminho = 0; correr_caminho < current_path.length; correr_caminho++) {
		componentOrderFix(correr_caminho)
	}
	definecompOnBranchesArr()

	function definecompOnBranchesArr() {
		for (var i = 0; i < arrBranchesWithoutCurrentSources.length; i++) {
			compOnBranchesArr[i] = [];
			for (var j = 0; j < ramos_comp[arrBranchesWithoutCurrentSources[i]].length; j++) {
				compOnBranchesArr[i].push(matriz[0][ramos_comp[arrBranchesWithoutCurrentSources[i]][j]])
			}
		}
	}
	// ----------------------------------------------------------- //
	// ----------------------------------------------------------- //
	// --CONVERT CURRENT AND REATANCES TO LATEX FORM (ADD INDEX)-- //
	var current_index = []
	var capacitorIndex = []
	var coilIndex = []
	criar_correntes_index();
	addCapacitorAndCoilIndex();

	function criar_correntes_index() {
		for (var i = 0; i < num_malhas; i++) {
			current_index.push("I_\{" + i + i + "\}")
		}
	}

	function addCapacitorAndCoilIndex() {
		for (var i = 0; i < Qtd_capacitors; i++) {
			capacitorIndex.push("\\underline{Z}_\{" + Capacitors[i] + "\}")
		}
		for (i = 0; i < Qtd_coils; i++) {
			coilIndex.push("\\underline{Z}_\{" + Coils[i] + "\}")
		}
	}
	// ----------------------------------------------------------- //
	// ----------------------------------------------------------- //
	// ----------------------------------------------------------- //
	// ----------------------------------------------------------- //
	// -----------------Sentido Fontes de Corrente------------------ //
	// ----------------------------------------------------------- //
	// ----------------------------------------------------------- //
	// -----------------Sentido Fontes de tensão------------------ //
	var voltageSourcePolarity = []
	defineVoltageSourcePolarity();

	function defineVoltageSourcePolarity() {
		for (var i = 0; i < matriz[0].length; i++) {
			if (matriz[0][i].includes("V") === true) {
				var voltageAux = []
				voltageAux.push(matriz[0][i])
				voltageAux.push(matriz[2][i])
				voltageAux.push(matriz[1][i])
				voltageAux.push(i)
				voltageSourcePolarity.push(voltageAux)
			}
		}
	}

	function defineVoltageSourcePolarityInMeshes(i, n) {
		var str = ""
		var strWithVoltageValue = ""
		for (var j = 0; j < voltageSourcePolarity.length; j++) {
			if (meshComps[i].includes(voltageSourcePolarity[j][3]) === true) {
				var auxPos = current_path[i].indexOf(voltageSourcePolarity[j][1])
				//console.log(auxPos, "auxPos")
				var auxPosInv = current_path[i].indexOf(voltageSourcePolarity[j][2])
				//console.log(auxPosInv, "auxPosInv")
				//console.log(voltageSourcePolarity[j], "v polarity")
				//console.log(current_path[i],"current path i")
				if ((current_path[i][auxPos] == voltageSourcePolarity[j][1] && current_path[i][auxPos + 1] == voltageSourcePolarity[j][2]) || (current_path[i][auxPos + 1] == voltageSourcePolarity[j][1] && current_path[i][auxPos + 2] == voltageSourcePolarity[j][2])) {
					if (str < 1) {
						str += voltageSourcePolarity[j][0]
						strWithVoltageValue += matriz[3][voltageSourcePolarity[j][3]]
					} else {
						str += " + " + voltageSourcePolarity[j][0]
						strWithVoltageValue += " + " + matriz[3][voltageSourcePolarity[j][3]]
					}
				} else if ((current_path[i][auxPosInv] == voltageSourcePolarity[j][2] && current_path[i][auxPosInv + 1] == voltageSourcePolarity[j][1]) || (current_path[i][auxPosInv + 1] == voltageSourcePolarity[j][2] && current_path[i][auxPosInv + 2] == voltageSourcePolarity[j][1])) {
					str += " - " + voltageSourcePolarity[j][0]
					strWithVoltageValue += " - " + matriz[3][voltageSourcePolarity[j][3]]
				}
			}
			if (j == voltageSourcePolarity.length - 1) {
				if (str < 1) {
					str += "0"
					strWithVoltageValue += "0"
				}
			}
		}
		var arr = [str, strWithVoltageValue]
		return arr[n]
	}
	console.log(compOnBranchesArr, "comps")
	//----------------------------------------------//
	//--------------------------------------------//
	//----------------------------------------------//
	function defineCurrentFlowInResistances(i, n) {
		var str = ""
		var strWithOhmValues = ""
		var flagNotUnique = 0;
		for (var k = 0; k < meshComps[i].length; k++) {
			var component = meshComps[i][k]
			var auxRes = matriz[0][component]
			var auxOhmValue = matriz[3][component]
			if (auxRes.includes("R") === true) {
				var moreThanTwo = 0
				for (var j = 0; j < meshComps.length; j++) {
					if (i !== j) {
						if (meshComps[j].includes(component) === true) {
							if (moreThanTwo == 0) {
								if (str.length < 2) {
									str += auxRes + " * ( " + current[i] + compWithDefinedPath(i, j, component) + " ) "
									strWithOhmValues += auxOhmValue + " * ( " + current[i] + compWithDefinedPath(i, j, component) + " ) "
								} else {
									//console.log(matriz[0][component],j,str.length)
									str += " + " + auxRes + " * ( " + current[i] + compWithDefinedPath(i, j, component)
									strWithOhmValues += " + " + auxOhmValue + " * ( " + current[i] + compWithDefinedPath(i, j, component)
								}
								flagNotUnique = 1
								moreThanTwo++
							} else {
								if (str[str.length - 2] === ')') {
									str = str.slice(0, str.length - 2)
									strWithOhmValues = strWithOhmValues.slice(0, strWithOhmValues.length - 2)
									str += compWithDefinedPath(i, j, component) + " ) "
									strWithOhmValues += compWithDefinedPath(i, j, component) + " ) "
								} else {
									str += compWithDefinedPath(i, j, component) + " ) "
									strWithOhmValues += compWithDefinedPath(i, j, component) + " ) "
								}
							}
						}
					}
					if (str[str.length - 2] !== ')') {
						if (str[str.length - 2] == "i") {
							str += " ) "
							strWithOhmValues += " ) "
						}
					}
				}
				if (flagNotUnique == 0) {
					if (str.length < 2) {
						str += auxRes + " * ( " + current[i] + " ) "
						strWithOhmValues += auxOhmValue + " * ( " + current[i] + " ) "
					} else {
						str += " + " + auxRes + " * ( " + current[i] + " ) "
						strWithOhmValues += " + " + auxOhmValue + " * ( " + current[i] + " ) "
					}
				}
			}
			flagNotUnique = 0
		}
		for (k = 0; k < currentSourcePolarity.length; k++) {
			//console.log("1 - String with Ohm Values: ",strWithOhmValues,current[k])
			str = replaceAll(str, current[k], matriz[3][currentSourcePolarity[k][3]])
			strWithOhmValues = replaceAll(strWithOhmValues, current[k], matriz[3][currentSourcePolarity[k][3]])
			//console.log("2 - String with Ohm Values: ",strWithOhmValues)
		}
		var arr = [str, strWithOhmValues]
		return arr[n]
	}

	function escapeRegExp(str) {
		return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}

	function replaceAll(str, find, replace) {
		return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}

	function compWithDefinedPath(mesh1, mesh2, component) {
		var str = ""
		var auxPosComp = meshComps[mesh1].indexOf(component)
		var auxPosComp_mesh2 = meshComps[mesh2].indexOf(component)
		var auxPosIni = 2 * auxPosComp
		var auxPosIni_mesh2 = 2 * auxPosComp_mesh2
		var posIniString = current_path[mesh1][auxPosIni]
		var posIniString_mesh2 = current_path[mesh2][auxPosIni_mesh2]
		if (posIniString !== posIniString_mesh2) {
			str += " - " + current[mesh2]
		} else if (posIniString === posIniString_mesh2) {
			str += " + " + current[mesh2]
		}
		//console.log("Malha",mesh1,":",posIniString,posFinString)
		//console.log("Malha",mesh2,":",posIniString_mesh2,posFinString_mesh2)
		return str
	}
	//--------------------CONSTRUCAO DE TABELA DE INFORMACOES DOS RAMOS-------//
	//--------------------------------------------------------------//
	//-----------------------------------------------------//
	var branchTable = [];

	function branchInfo() {
		for (var i = 0; i < branchesWithoutCurrentSources.length; i++) {
			branchTable[i].push(branchesWithoutCurrentSources[i])
			//for(var j=0; j<compOnBranchesArr[])
		}
	}
	var currentwithoutnett = [];
	//infoinfo()
	function infoinfo() {
		for (var i = 0; i < mesh.length; i++) {
			currentwithoutnett[i] = [];
			for (var j = 0; j < mesh[i].length; j++) {
				if (j == 0) {
					currentwithoutnett[i].push(currentWithoutNet[i][0])
					if (currentwithoutnett[i][0] == ramos_coord[mesh[i][j]][0]) {
						currentwithoutnett[i].push(ramos_coord[mesh[i][j]][1])
					} else {
						currentwithoutnett[i].push(ramos_coord[mesh[i][j]][0])
					}
				} else if (j > 0) {
					if (currentwithoutnett[i][currentwithoutnett[i].length - 1] == ramos_coord[mesh[i][j]][0]) {
						currentwithoutnett[i].push(ramos_coord[mesh[i][j]][0])
						currentwithoutnett[i].push(ramos_coord[mesh[i][j]][1])
					} else {
						currentwithoutnett[i].push(ramos_coord[mesh[i][j]][1])
						currentwithoutnett[i].push(ramos_coord[mesh[i][j]][0])
					}
				}
			}
		}
	}
	console.log(matriz, "matriz")
	console.table(currentwithoutnett, "Caminho de nós")
	console.log(meshComps, "mesh comps")
	console.table(mesh, "Malhas")
	console.log(matriz, "matriz")
	console.log(compOnBranchesArr, "comp on branches")
	console.log(arrBranchesWithoutCurrentSources, "branches without c sourses")
	var branchesWithoutVSources = [];
	bwithoutVsources()

	function bwithoutVsources() {
		for (var i = 0; i < arrBranchesWithoutCurrentSources.length; i++) {
			branchesWithoutVSources[i] = []
			for (var j = 0; j < compOnBranchesArr[i].length; j++) {
				if (compOnBranchesArr[i][j].includes("V") == false) {
					branchesWithoutVSources[i].push(compOnBranchesArr[i][j])
				}
			}
		}
	}
	console.log(branchesWithoutVSources, "branches without v sources")
	console.log(currentWithoutNet, "current w net")
	var route = [];
	mesh_node_comp_node()

	function mesh_node_comp_node() {
		for (var i = 0; i < meshComps.length; i++) {
			route[i] = [];
			route[i].push(currentWithoutNet[i][0])
			var cont = 0;
			var cont2 = 0;
			for (var j = 0; j < meshComps[i].length; j++) {
				if (matriz[0][meshComps[i][j]].includes("V") == false) {
					route[i].push(matriz[0][meshComps[i][j]])
				}
			}
			//route[i].push(currentWithoutNet[i][currentWithoutNet[i].length - 1])
			console.log(route[i])
		}
	}
	//writeEqu()
	function writeEqu(i, n) {
		var arr = []
		var str = ""
		var value = ""
		var x = 0;
		var auxBranch = 0;
		//for(var i=0; i<mesh.length; i++){//por cada malha
		var counter = 1
		for (var j = 0; j < mesh[i].length; j++) { //por cada ramo
			auxBranch = "I" + mesh[i][j]
			for (var k = 0; k < arrBranchesWithoutCurrentSources.length; k++) { //por cada ramo sem FC
				if (arrBranchesWithoutCurrentSources[k] == mesh[i][j]) { //vai buscar o numero do ramo
					if (branchesWithoutVSources[k].length == 1) {
						if (j < mesh[i].length - 1) {
							if (currentWithoutNet[i].indexOf(ramos_coord[mesh[i][j]][0]) < currentWithoutNet[i].indexOf(ramos_coord[mesh[i][j]][1])) //sentido positivo
							{ //console.log("tamanho 1 positivo", )
								//console.log(ramos_coord[mesh[i][j]][0])
								//console.log(ramos_coord[mesh[i][j]][1])
								str += " + " + auxBranch + " * ( " + branchesWithoutVSources[k] + " ) "
								value += " + " + auxBranch + " * ( " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][0])] + " ) "
								//console.log(value)
							} else { //sentido negativo
								//console.log("tamanho 1 negativo")
								//console.log(ramos_coord[mesh[i][j]][0])
								// console.log(ramos_coord[mesh[i][j]][1])
								str += " - " + auxBranch + " * ( " + branchesWithoutVSources[k] + " ) "
								value += " - " + auxBranch + " * ( " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][0])] + " ) "
							}
						} else {
							if (ramos_coord[mesh[i][j]][0] == currentWithoutNet[i][currentWithoutNet[i].length - 1]) { //console.log("tamanho 1 positivo" )
								//console.log(ramos_coord[mesh[i][j]][0])
								//console.log(ramos_coord[mesh[i][j]][1])
								//console.log(route[i][route[i].length-1])
								str += " + " + auxBranch + " * ( " + branchesWithoutVSources[k] + " ) "
								value += " + " + auxBranch + " * ( " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][0])] + " ) "
							} else { //console.log("tamanho 1 negativo")
								//console.log(ramos_coord[mesh[i][j]][0])
								//console.log(ramos_coord[mesh[i][j]][1])
								//console.log(route[i][route[i].length-1])
								str += " - " + auxBranch + " * ( " + branchesWithoutVSources[k] + " ) "
								value += " - " + auxBranch + " * ( " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][0])] + " ) "
							}
						}
					} else {
						if (branchesWithoutVSources[k][0] == route[i][counter]) {
							//console.log("tamanho 12 positivo", counter, "counter", k,"k",i,"i")
							for (var l = 0; l < branchesWithoutVSources[k].length; l++) {
								console.log(branchesWithoutVSources[k], "without v")
								if (l == 0) {
									str += " + " + auxBranch + " * ( " + branchesWithoutVSources[k][l]
									value += " + " + auxBranch + " * ( " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][l])]
								} else if (l > 0 && l < branchesWithoutVSources[k].length - 1) {
									str += " + " + branchesWithoutVSources[k][l]
									value += " + " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][l])]
								} else if (l == branchesWithoutVSources[k].length - 1) {
									str += " + " + branchesWithoutVSources[k][l] + " )"
									//value += " + " + auxBranch +  matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][l])] + " ) "
									value += " + " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][l])] + " ) "
								}
							}
						} else { //console.log("tamanho 12 negativo",counter, "counter", k,"k",i,"i")
							for (var m = 0; m < branchesWithoutVSources[k].length; m++) {
								if (m == 0) {
									str += " - " + auxBranch + " * ( " + branchesWithoutVSources[k][m]
									value += " - " + auxBranch + " * ( " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][m])]
								} else if (m > 0 && m < branchesWithoutVSources[k].length - 1) {
									str += " + " + branchesWithoutVSources[k][m]
									value += " + " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][m])]
								} else if (m == branchesWithoutVSources[k].length - 1) {
									str += " + " + branchesWithoutVSources[k][m] + " )"
									value += " + " + matriz[3][matriz[0].indexOf(branchesWithoutVSources[k][m])] + " )"
								}
							}
						}
					}
					counter = counter + branchesWithoutVSources[k].length
				}
			}
		}
		counter = 0;
		str += " = " + defineVoltageSourcePolarityInMeshes(i, 0)
		value += " = " + defineVoltageSourcePolarityInMeshes(i, 1)
		console.log(value)
		console.log(str)
		arr = [str, value]
		return (arr[n])
		str = ""
		//}
	}
	var branchesWithCSource = [];
	branchesWithCSourceF();

	function branchesWithCSourceF() {
		for (var i = 0; i < ramos_comp.length; i++) {
			if (arrBranchesWithoutCurrentSources.includes(i) == false) {
				branchesWithCSource.push(i)
			}
		}
	}
	console.table(ramos_coord, "Nós limitantes do Ramo")
	var vet_n = [];
	var cont = 0;

	function writeNodeEqu(i) {
		var aux
		var m;
		var flag
		var flag2 = 0;
		var str = ""
		var IC = 0;
		if (vetor_nos_reais[i].includes("gnd") == false) {
			vet_n[cont] = vetor_nos_reais[i];
			cont++;
			for (var j = 0; j < groupArray[i].length; j++) {
				if (branchesWithCSource.includes(groupArray[i][j]) == true) {
					flag = 0;
					for (var k = 0; k < ramos_comp[groupArray[i][j]].length; k++) {
						if (matriz[0][ramos_comp[groupArray[i][j]][k]].includes("I")) {
							IC = matriz[3][ramos_comp[groupArray[i][j]][k]]
							m = k;
						}
					}
					if (vetor_nos_reais.includes(matriz[1][ramos_comp[groupArray[i][j]][m]]) && vetor_nos_reais.includes(matriz[2][ramos_comp[groupArray[i][j]][m]]) && flag == 0) {
						flag = 1;
						if (vetor_nos_reais[i] == matriz[1][ramos_comp[groupArray[i][j]][m]]) {
							str += " + " + IC
						} else str += " - " + IC
					} else if (vetor_nos_virtuais.includes(matriz[1][ramos_comp[groupArray[i][j]][m]]) && vetor_nos_virtuais.includes(matriz[2][ramos_comp[groupArray[i][j]][m]]) && flag == 0) {
						for (var o = 0; o < matriz[0].length; o++) {
							if (matriz[1][o] == matriz[1][ramos_comp[groupArray[i][j]][m]] && matriz[0][o] != matriz[0][ramos_comp[groupArray[i][j]][m]]) {
								aux = o
							}
							if (matriz[2][o] == matriz[1][ramos_comp[groupArray[i][j]][m]] && o != matriz[1].indexOf(matriz[1][ramos_comp[groupArray[i][j]][m]])) {
								aux = o
							}
						}
						if (ramos_comp[groupArray[i][j]].indexOf(aux) < ramos_comp[groupArray[i][j]].indexOf(ramos_comp[groupArray[i][j]][m])) {
							if (vetor_nos_reais[i] == matriz[1][ramos_comp[groupArray[i][j]][0]] || vetor_nos_reais[i] == matriz[2][ramos_comp[groupArray[i][j]][0]]) {
								str += " + " + IC
							} else {
								str += " - " + IC
							}
						} else {
							if (vetor_nos_reais[i] == matriz[1][ramos_comp[groupArray[i][j]][ramos_comp[groupArray[i][j]].length - 1]] || vetor_nos_reais[i] == matriz[2][ramos_comp[groupArray[i][j]][ramos_comp[groupArray[i][j]].length - 1]]) {
								str += " + " + IC
							} else {
								str += " - " + IC
							}
						}
						flag = 1
					} else if (flag == 0) {
						if (vetor_nos_reais[i] == matriz[1][ramos_comp[groupArray[i][j]][m]] || matriz[2][ramos_comp[groupArray[i][j]][m]] == "gnd") {
							str += " + " + IC
						} else str += " - " + IC
					}
				} else if (ramos_coord[groupArray[i][j]][1] == vetor_nos_reais[i]) {
					str += " +I" + groupArray[i][j]
				} else str += " -I" + groupArray[i][j]
			}
		}
		return (str)
	}

	var complex_flag = 0;
	// ----------------------------------------------------------- //
	// ----------------------------------------------------------- //
	// -----------------Equações das Malhas----------------------- //
	console.log(arrBranchesWithoutCurrentSources, "ramos sem FC")
	console.log(ramos_coord, "coordenadas dos ramos")
	console.table(compOnBranchesArr, "Componentes de cada Ramo")
	console.log(ramos_comp, "ramos comp")
	var equationsArr = []
	var string_final = ""
	var lmao = num_ramos - (num_nos - 1) - num_CurrentSources

	function meshesEquations() {
		var str = ""
		var strEqu = ""
		var LaTex = ""
		var rn = 0
		//str += "<head><link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.2/katex.min.css\"></head><body>"
		str += '<div class="card col-md-12 align-content-center align-items-center"><div class="card-body"><h5 class="text-center font-weight-bold text-dark">Branch Current Method (BCM) Analysis</h5>';
		if (fileContents[0]) { str += '<div class="text-center"><img class="img-max mx-auto d-block" src='+fileContents[0]+'></div>' };
		str += '<h6 class="font-weight-bold text-dark">1. Fundamental variables of the circuit</h6>';
		str += "<p>Branches (R): " + num_ramos + "  |  Nodes (N): " + num_nos + "  |  Current Source (FC): " + num_CurrentSources + " </p>";
		str += "<p>Number of different Mesh combinations:" + maxPossibleMeshes + "</p>";
		str += "<p>Number of independent Meshes that need to be defined:  R - (N - 1) - FC = " + num_ramos + " - ( " + num_nos + " - 1 ) - " + num_CurrentSources + " = " + lmao + "</p>";
		str += '<h6 class="font-weight-bold text-dark">2. Identification/direction of branch currents:</h6>';
		for (var i = 0; i < matriz[0].length; i++) {
			if (matriz[0][i].includes("C") || matriz[0][i].includes("L")) complex_flag = 1;
		}
		for (var i = 0; i < arrBranchesWithoutCurrentSources.length; i++) {
			str += "<p>Branch " + arrBranchesWithoutCurrentSources[i] + " composed by: " + compOnBranchesArr[i] + "    |    I" + arrBranchesWithoutCurrentSources[i] + ": " + ramos_coord[arrBranchesWithoutCurrentSources[i]][0] + " 	&rarr; " + ramos_coord[arrBranchesWithoutCurrentSources[i]][1] + "</p>"
		}

		console.log(vetor_nos_reais, "vetor nos reais")
		str += '<h6 class="font-weight-bold text-dark">3. Node Equations:</h6>';
		for (var l = 0; l < vetor_nos_reais.length; l++) {
			strEqu = ""
			if (vetor_nos_reais[l].includes("gnd") == false) {
				str += "<p>Node " + vetor_nos_reais[l] + ": " + "</p>";
				strEqu = writeNodeEqu(l);
				strEqu += " = 0";
				console.log(strEqu);
				LaTex = nerdamer(strEqu).toTeX();
				str += katex.renderToString(LaTex);
			}
		}
		console.log(compOnMeshesArr)
		console.log(currentWithoutNet)
		str += '<h6 class="font-weight-bold text-dark">4. Identification/Direction of Meshes + Mesh Equations:</h6>'
		for (i = 0 /*currentSourcePolarity.length*/ ; i < QtdMalhas; i++) {
			strEqu = ""

			str += "<p>Mesh " + (i) + " composed by: " + compOnMeshesArr[i] + " | " + currentWithoutNet[i][0] + "  	&rarr;  " + currentWithoutNet[i][1] + " ,starting on " + matriz[0][ramos_comp[mesh[i][0]][0]] + "</p>"
			strEqu = writeEqu(i, 0)

			LaTex = nerdamer(strEqu).toTeX()
			for (rn = 0; rn < current.length; rn++) {
				LaTex = LaTex.replace(new RegExp(current[rn], 'g'), current_index[rn])
			}
			for (var k = 0; k < Qtd_capacitors; k++) {
				LaTex = LaTex.replace(new RegExp(Capacitors[k], 'g'), capacitorIndex[k])
			}
			for (k = 0; k < Qtd_coils; k++) {
				LaTex = LaTex.replace(new RegExp(Coils[k], 'g'), coilIndex[k])
			}
			str += katex.renderToString(LaTex)
			equationsArr[i] = []
			equationsArr[i].push(strEqu)
		}
		return str
	}
	string_final += meshesEquations()

	if (complex_flag == 0) {
		string_final += equacoesFinaisLATEX();
	}

	function equacoesFinaisLATEX() {
		var str = ""
		var resul = []
		var rn = 0;
		for (var cam = 0; cam < QtdMalhas; cam++) {
			str = ""
			str = writeEqu(cam, 1)
			resul.push(str)
		}
		for (var l = 0; l < vetor_nos_reais.length; l++) {
			strEqu = ""
			if (vetor_nos_reais[l].includes("gnd") == false) {
				strEqu = writeNodeEqu(l)
				strEqu += " = 0"
				console.log(strEqu)
				resul.push(strEqu)
			}
		}
		str = ""
		var sol = nerdamer.solveEquations(resul);
		str += '<h6 class="font-weight-bold text-dark">5. System of Equations:</h6>';
		for (var i = 0; i < resul.length; i++) {
			var LaTex = nerdamer(resul[i] + '= 0').toTeX()

			if (i < QtdMalhas) {
				str += "<b>Mesh " + (i) + ": </b>" + katex.renderToString(LaTex) + "<br>"
			} else str += "<b>Node " + (vet_n[i - QtdMalhas]) + ": </b>" + katex.renderToString(LaTex) + "<br>"
		}
		console.log(vet_n, "lmfao)")
		str += '<h6 class="font-weight-bold text-dark">6. Solution (of the system of equations):</h6>';
		for (var k = 0; k < resul.length; k++) {
			var stringApoio = ""
			stringApoio += sol[k][0]
			var LaTex2 = nerdamer(stringApoio).toTeX()

			// Mudar o ponto por virgula
			var aux = sol[k][1].toFixed(3)
			aux.toString()
			aux = aux.replace(".", ",")
			aux = aux.replace("-", "- ")
			//console.log(aux)
			if (sol[k][1] < 0) {
				str += katex.renderToString(LaTex2) + " = " + aux + " A<br>"
			} else {
				str += katex.renderToString(LaTex2) + " = " + aux + " A<br>"
			}
		}
		str += "</div></div>";
		//document.getElementById("equations").innerHTML = str;
		return str
	}
	//___________________________________________________________//
	//_____________________FUNÇÕES VARIADAS_____________________//
	function trocar_coluna(col) {
		if (col == 1) {
			col = 2;
		} else {
			col = 1;
		}
		return col;
	}

	function encontrar_ponto_comum(no, comp_analisados) {
		var lin = 0;
		var col = 1; //Valor varia entre 1 e 2 (Colunas de posição)
		var linha_nova = 0;
		var coluna_nova = 0;
		for (col = 0; col < 3; col++) {
			lin = 0;
			while (lin < linhas_matriz) {
				if (comp_analisados.indexOf(lin) == -1) { //Se a linha ainda não tiver sido analisada
					if (matriz[col][lin] == no) {
						linha_nova = lin;
						coluna_nova = col;
						break;
					}
				}
				lin++;
			}
		}
		return [linha_nova, coluna_nova];
	}
	//Apresenta resultados
	novajanela();
};