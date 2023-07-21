
function selectFileFromDB(ID){
   
   // Generate the Examples Info
   let DCexample1 = new Array();
   let DCexample2 = new Array();
   let DCexample3 = new Array();
   let DCexample4 = new Array();

   // DC Example 1
   DCexample1.push( new File([""], "DCexample1IMG.png"));
   DCexample1.push( new File([""], "DCexample1.sch"));
   DCexample1[0].type = "image/png";
   DCexample1[0].lastModified = 1601573677717;
   DCexample1[0].size = 9221;
   DCexample1[1].type = "text/plain";
   DCexample1[1].lastModified = 1601573723601;
   DCexample1[1].size = 801;
   // DC Example 2
   DCexample2.push( new File([""], "DCexample2IMG.png"));
   DCexample2.push( new File([""], "DCexample2.sch"));
   DCexample2[0].type = "image/png";
   DCexample2[0].lastModified = 1601575885103;
   DCexample2[0].size = 11747;
   DCexample2[1].type = "text/plain";
   DCexample2[1].lastModified = 1601575918338;
   DCexample2[1].size = 942;
   // DC Example 3
   DCexample3.push( new File([""], "DCexample3IMG.png"));
   DCexample3.push( new File([""], "DCexample3.sch"));
   DCexample3[0].type = "image/png";
   DCexample3[0].lastModified = 1601581395022;
   DCexample3[0].size = 9886;
   DCexample3[1].type = "text/plain";
   DCexample3[1].lastModified = 1601581418912;
   DCexample3[1].size = 916;
   // DC Example 4
   DCexample4.push( new File([""], "DCexample4IMG.png"));
   DCexample4.push( new File([""], "DCexample4.sch"));
   DCexample4[0].type = "image/png";
   DCexample4[0].lastModified = 1601931327095;
   DCexample4[0].size = 13204;
   DCexample4[1].type = "text/plain";
   DCexample4[1].lastModified = 1601931361138;
   DCexample4[1].size = 987;


   // Netlists
   /*
   DCexample1[1].data='R:R5 _net0 C R="50 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'IProbe:Ir4 B _net1\n'+
   'R:R6 _net1 C R="40 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'IProbe:Ir5 _net2 gnd\n'+
   'IProbe:Ir3 C _net3\n'+
   'R:R2 _net4 A R="20 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R4 _net3 _net5 R="60 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'IProbe:Ir2 B _net4\n'+
   'IProbe:Ir6 gnd _net0\n'+
   'R:R3 _net2 B R="10 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R1 gnd _net6 R="10 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'Vdc:V1 _net7 _net6 U="12 V"\n'+
   'IProbe:Ir1 _net7 A\n'+
   'Idc:I1 A _net5 I="0.5 A"\n';

   DCexample2[1].data='Vdc:V1 _net4 gnd U="12 V"\n'+
   'Vdc:V2 _net0 _net5 U="2 V"\n'+
   'R:R6 _net6 C R="20 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R5 C _net3 R="40 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R7 _net5 gnd R="80 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R2 B _net7 R="20 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'IProbe:Ir1 _net4 A\n'+
   'IProbe:Ir2 A _net7\n'+
   'R:R1 _net2 B R="20 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'IProbe:Ir3 gnd _net2\n'+
   'IProbe:Ir5 _net3 gnd\n'+
   'IProbe:Ir6 _net6 D\n'+
   'IProbe:Ir8 _net1 D\n'+
   'IProbe:Ir7 _net0 D\n'+
   'IProbe:Ir4 _net8 C\n'+
   'R:R4 _net8 B R="40 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R3 _net9 A R="10 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'Idc:I1 _net1 _net9 I="0.1 A"\n';

   DCexample3[1].data='IProbe:Ir1 _net0 gnd\n'+
   'IProbe:Ir2 _net1 gnd\n'+
   'IProbe:Ir3 _net2 B\n'+
   'IProbe:Ir4 A _net3\n'+
   'IProbe:Ir5 _net4 C\n'+
   'IProbe:Ir7 C _net5\n'+
   'IProbe:Ir6 _net6 gnd\n'+
   'IProbe:Ir8 _net7 gnd\n'+
   'Vdc:V1 A _net2 U="10 V"\n'+
   'R:R7 D _net5 R="20 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R3 _net6 C R="40 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'Vdc:V2 D _net8 U="9 V"\n'+
   'R:R2 _net1 B R="10 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R5 _net4 B R="80 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R4 _net7 D R="10 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R1 _net0 A R="40 Ohm" Temp="26.85" Tc1="30 Ohm" Tc2="0.0" Tnom="26.85"\n'+
   'R:R6 _net8 _net3 R="20 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n';

   DCexample4[1].data='IProbe:Ir1 _net0 A\n'+
   'IProbe:Ir2 A _net1\n'+
   'IProbe:Ir3 _net2 gnd\n'+
   'IProbe:Ir4 _net3 _net4\n'+
   'IProbe:Ir7 B _net5\n'+
   'IProbe:Ir8 _net6 C\n'+
   'IProbe:Ir9 D _net7\n'+
   'IProbe:Ir5 A _net8\n'+
   'IProbe:Ir6 B _net9\n'+
   'Vdc:V1 _net0 gnd U="8 V"\n'+
   'Vdc:V2 _net10 _net2 U="5 V"\n'+
   'Vdc:V3 _net5 C U="12 V"\n'+
   'R:R2 _net10 B R="10 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'Idc:I1 D _net4 I="0.5 A"\n'+
   'R:R5 _net8 D R="20 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R1 gnd _net1 R="25 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R3 A _net9 R="40 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R4 gnd _net3 R="30 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R6 A _net6 R="100 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n'+
   'R:R7 C _net7 R="60 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"\n';
   */

   // Schematics
   DCexample1[1].data = '<Qucs Schematic 0.0.19>\n'+
   '<Properties>\n'+
      '<View=0,0,862,800,1,0,0>\n'+
      '<Grid=10,10,1>\n'+
      '<DataSet=Exemplo1.dat>\n'+
      '<DataDisplay=Exemplo1.dpl>\n'+
      '<OpenDisplay=1>\n'+
      '<Script=Exemplo1.m>\n'+
      '<RunScript=0>\n'+
      '<showFrame=0>\n'+
      '<FrameText0=Título>\n'+
      '<FrameText1=Autor:>\n'+
      '<FrameText2=Data:>\n'+
      '<FrameText3=Revisão:>\n'+
   '</Properties>\n'+
   '<Symbol>\n'+
   '</Symbol>\n'+
   '<Components>\n'+
     '<Vdc V1 1 250 300 18 -16 0 1 "12 V" 1 "0 Ohm" 0>\n'+
     '<R R5 1 780 460 15 -17 0 3 "50 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<Idc I1 1 620 140 -20 -54 0 2 "0.5 A" 1 "0 Ohm" 0>\n'+
     '<R R1 1 250 420 15 -18 0 1 "10 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir1 1 250 210 19 3 0 1 "0 Ohm" 0>\n'+
     '<IProbe Ir2 1 480 290 -55 2 0 1 "0 Ohm" 0>\n'+
     '<IProbe Ir4 1 580 350 -11 -54 0 0 "0 Ohm" 0>\n'+
     '<R R3 1 480 400 15 -26 0 1 "10 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir5 1 480 480 36 -9 0 3 "0 Ohm" 0>\n'+
     '<GND * 1 480 540 0 0 0 0>\n'+
     '<IProbe Ir6 1 650 520 -10 -55 0 0 "0 Ohm" 0>\n'+
     '<IProbe Ir3 1 780 280 -54 3 0 1 "0 Ohm" 0>\n'+
     '<R R2 1 480 210 15 -19 0 1 "20 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R6 1 700 350 -31 14 0 2 "40 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R4 1 780 190 15 -21 0 3 "60 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
   '</Components>\n'+
   '<Wires>\n'+
     '<480 430 480 450 "" 0 0 0 "">\n'+
     '<480 510 480 520 "" 0 0 0 "">\n'+
     '<780 350 780 430 "" 0 0 0 "">\n'+
     '<480 140 590 140 "" 0 0 0 "">\n'+
     '<480 350 480 370 "" 0 0 0 "">\n'+
     '<480 350 550 350 "" 0 0 0 "">\n'+
     '<250 330 250 390 "" 0 0 0 "">\n'+
     '<250 520 480 520 "" 0 0 0 "">\n'+
     '<250 450 250 520 "" 0 0 0 "">\n'+
     '<250 140 480 140 "" 0 0 0 "">\n'+
     '<250 140 250 180 "" 0 0 0 "">\n'+
     '<250 240 250 270 "" 0 0 0 "">\n'+
     '<480 320 480 350 "" 0 0 0 "">\n'+
     '<480 520 480 540 "" 0 0 0 "">\n'+
     '<780 490 780 520 "" 0 0 0 "">\n'+
     '<680 520 780 520 "" 0 0 0 "">\n'+
     '<480 520 620 520 "" 0 0 0 "">\n'+
     '<780 310 780 350 "" 0 0 0 "">\n'+
     '<780 220 780 250 "" 0 0 0 "">\n'+
     '<650 140 780 140 "" 0 0 0 "">\n'+
     '<780 140 780 160 "" 0 0 0 "">\n'+
     '<480 140 480 180 "" 0 0 0 "">\n'+
     '<480 240 480 260 "" 0 0 0 "">\n'+
     '<610 350 670 350 "" 0 0 0 "">\n'+
     '<730 350 780 350 "" 0 0 0 "">\n'+
     '<780 350 780 350 "C" 790 320 0 "">\n'+
     '<480 140 480 140 "A" 460 110 0 "">\n'+
     '<480 350 480 350 "B" 450 320 0 "">\n'+
   '</Wires>\n'+
   '<Diagrams>\n'+
   '</Diagrams>\n'+
   '<Paintings>\n'+
   '</Paintings>'

   DCexample2[1].data = '<Qucs Schematic 0.0.19>\n'+
   '<Properties>\n'+
     '<View=0,-21,944,1010,0.909091,0,0>\n'+
     '<Grid=10,10,1>\n'+
     '<DataSet=Exemplo 2.dat>\n'+
     '<DataDisplay=Exemplo 2.dpl>\n'+
     '<OpenDisplay=1>\n'+
     '<Script=Exemplo 2.m>\n'+
     '<RunScript=0>\n'+
     '<showFrame=0>\n'+
     '<FrameText0=Título>\n'+
     '<FrameText1=Autor:>\n'+
     '<FrameText2=Data:>\n'+
     '<FrameText3=Revisão:>\n'+
   '</Properties>\n'+
   '<Symbol>\n'+
   '</Symbol>\n'+
   '<Components>\n'+
     '<IProbe Ir3 1 350 470 16 -7 0 1 "0 Ohm" 0>\n'+
     '<GND * 1 430 590 0 0 0 0>\n'+
     '<R R1 1 350 370 15 -17 0 1 "20 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir5 1 610 470 36 -8 0 3 "0 Ohm" 0>\n'+
     '<IProbe Ir6 1 610 150 -54 -9 0 1 "0 Ohm" 0>\n'+
     '<R R6 1 610 250 14 -19 0 3 "20 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R5 1 610 370 10 -20 0 3 "40 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir4 1 530 300 -9 -55 0 0 "0 Ohm" 0>\n'+
     '<IProbe Ir7 1 830 180 -56 -9 0 1 "0 Ohm" 0>\n'+
     '<Vdc V2 1 830 310 -64 -22 0 1 "2 V" 1 "0 Ohm" 0>\n'+
     '<R R7 1 830 430 -92 -26 0 3 "80 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir1 1 90 370 15 -7 0 1 "0 Ohm" 0>\n'+
     '<Vdc V1 1 90 480 18 -26 0 1 "12 V" 1 "0 Ohm" 0>\n'+
     '<IProbe Ir2 1 170 300 -26 16 0 0 "0 Ohm" 0>\n'+
     '<R R2 1 260 300 -26 14 0 2 "20 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R3 1 180 100 -8 17 0 2 "10 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<Idc I1 1 300 100 -7 18 0 0 "0.1 A" 1 "0 Ohm" 0>\n'+
     '<IProbe Ir8 1 480 100 -11 17 0 0 "0 Ohm" 0>\n'+
     '<R R4 1 430 300 -4 12 0 2 "40 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
   '</Components>\n'+
   '<Wires>\n'+
     '<350 540 430 540 "" 0 0 0 "">\n'+
     '<350 500 350 540 "" 0 0 0 "">\n'+
     '<350 300 350 340 "" 0 0 0 "">\n'+
     '<350 400 350 440 "" 0 0 0 "">\n'+
     '<430 540 430 590 "" 0 0 0 "">\n'+
     '<610 300 610 340 "" 0 0 0 "">\n'+
     '<430 540 610 540 "" 0 0 0 "">\n'+
     '<610 500 610 540 "" 0 0 0 "">\n'+
     '<610 400 610 440 "" 0 0 0 "">\n'+
     '<610 280 610 300 "" 0 0 0 "">\n'+
     '<610 100 610 120 "" 0 0 0 "">\n'+
     '<610 180 610 220 "" 0 0 0 "">\n'+
     '<560 300 610 300 "" 0 0 0 "">\n'+
     '<610 100 830 100 "" 0 0 0 "">\n'+
     '<610 540 830 540 "" 0 0 0 "">\n'+
     '<830 460 830 540 "" 0 0 0 "">\n'+
     '<830 340 830 400 "" 0 0 0 "">\n'+
     '<830 210 830 280 "" 0 0 0 "">\n'+
     '<830 100 830 150 "" 0 0 0 "">\n'+
     '<90 540 350 540 "" 0 0 0 "">\n'+
     '<90 300 90 340 "" 0 0 0 "">\n'+
     '<90 510 90 540 "" 0 0 0 "">\n'+
     '<90 400 90 450 "" 0 0 0 "">\n'+
     '<90 300 140 300 "" 0 0 0 "">\n'+
     '<200 300 230 300 "" 0 0 0 "">\n'+
     '<290 300 350 300 "" 0 0 0 "">\n'+
     '<90 100 90 300 "" 0 0 0 "">\n'+
     '<90 100 150 100 "" 0 0 0 "">\n'+
     '<210 100 270 100 "" 0 0 0 "">\n'+
     '<510 100 610 100 "" 0 0 0 "">\n'+
     '<330 100 450 100 "" 0 0 0 "">\n'+
     '<350 300 400 300 "" 0 0 0 "">\n'+
     '<460 300 500 300 "" 0 0 0 "">\n'+
     '<350 300 350 300 "B" 330 270 0 "">\n'+
     '<610 100 610 100 "D" 590 70 0 "">\n'+
     '<610 300 610 300 "C" 580 270 0 "">\n'+
     '<90 300 90 300 "A" 60 270 0 "">\n'+
   '</Wires>\n'+
   '<Diagrams>\n'+
   '</Diagrams>\n'+
   '<Paintings>\n'+
   '</Paintings>'

   DCexample3[1].data = '<Qucs Schematic 0.0.19>\n'+
   '<Properties>\n'+
     '<View=18,47,902,1012,0.971822,0,107>\n'+
     '<Grid=10,10,1>\n'+
     '<DataSet=Exemplo 3.dat>\n'+
     '<DataDisplay=Exemplo 3.dpl>\n'+
     '<OpenDisplay=1>\n'+
     '<Script=Exemplo 3.m>\n'+
     '<RunScript=0>\n'+
     '<showFrame=0>\n'+
     '<FrameText0=Título>\n'+
     '<FrameText1=Autor:>\n'+
     '<FrameText2=Data:>\n'+
     '<FrameText3=Revisão:>\n'+
   '</Properties>\n'+
   '<Symbol>\n'+
   '</Symbol>\n'+
   '<Components>\n'+
     '<Vdc V2 1 610 140 -22 -54 0 0 "9 V" 1 "0 Ohm" 0>\n'+
     '<IProbe Ir1 1 100 460 39 -10 0 3 "0 Ohm" 0>\n'+
     '<IProbe Ir3 1 250 290 -8 17 0 0 "0 Ohm" 0>\n'+
     '<IProbe Ir2 1 320 460 37 -8 0 3 "0 Ohm" 0>\n'+
     '<IProbe Ir4 1 250 140 -13 17 0 0 "0 Ohm" 0>\n'+
     '<R R5 1 390 290 -26 -53 0 2 "80 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir5 1 480 290 -26 16 0 0 "0 Ohm" 0>\n'+
     '<IProbe Ir6 1 550 460 39 -9 0 3 "0 Ohm" 0>\n'+
     '<IProbe Ir7 1 610 290 -26 16 0 0 "0 Ohm" 0>\n'+
     '<IProbe Ir8 1 780 460 35 -13 0 3 "0 Ohm" 0>\n'+
     '<Vdc V1 1 150 290 -26 -56 0 2 "10 V" 1 "0 Ohm" 0>\n'+
     '<R R6 1 420 140 -17 16 0 2 "20 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R1 1 100 360 15 -26 0 1 "40 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R2 1 320 360 15 -26 0 1 "10 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R3 1 550 360 15 -26 0 1 "40 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R4 1 780 360 15 -26 0 1 "10 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R7 1 710 290 -26 -53 0 2 "20 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<GND * 1 440 570 0 0 0 0>\n'+
   '</Components>\n'+
   '<Wires>\n'+
     '<100 390 100 430 "" 0 0 0 "">\n'+
     '<100 290 100 330 "" 0 0 0 "">\n'+
     '<100 490 100 520 "" 0 0 0 "">\n'+
     '<100 520 320 520 "" 0 0 0 "">\n'+
     '<320 520 440 520 "" 0 0 0 "">\n'+
     '<320 490 320 520 "" 0 0 0 "">\n'+
     '<280 290 320 290 "" 0 0 0 "">\n'+
     '<320 290 320 330 "" 0 0 0 "">\n'+
     '<320 390 320 430 "" 0 0 0 "">\n'+
     '<320 290 360 290 "" 0 0 0 "">\n'+
     '<420 290 450 290 "" 0 0 0 "">\n'+
     '<550 490 550 520 "" 0 0 0 "">\n'+
     '<550 390 550 430 "" 0 0 0 "">\n'+
     '<510 290 550 290 "" 0 0 0 "">\n'+
     '<550 290 550 330 "" 0 0 0 "">\n'+
     '<550 290 580 290 "" 0 0 0 "">\n'+
     '<640 290 680 290 "" 0 0 0 "">\n'+
     '<550 520 780 520 "" 0 0 0 "">\n'+
     '<780 490 780 520 "" 0 0 0 "">\n'+
     '<780 390 780 430 "" 0 0 0 "">\n'+
     '<740 290 780 290 "" 0 0 0 "">\n'+
     '<780 290 780 330 "" 0 0 0 "">\n'+
     '<100 140 220 140 "" 0 0 0 "">\n'+
     '<100 140 100 290 "" 0 0 0 "">\n'+
     '<180 290 220 290 "" 0 0 0 "">\n'+
     '<100 290 120 290 "" 0 0 0 "">\n'+
     '<280 140 390 140 "" 0 0 0 "">\n'+
     '<450 140 580 140 "" 0 0 0 "">\n'+
     '<640 140 780 140 "" 0 0 0 "">\n'+
     '<780 140 780 290 "" 0 0 0 "">\n'+
     '<440 520 550 520 "" 0 0 0 "">\n'+
     '<440 520 440 570 "" 0 0 0 "">\n'+
     '<100 290 100 290 "A" 70 260 0 "">\n'+
     '<320 290 320 290 "B" 330 250 0 "">\n'+
     '<550 290 550 290 "C" 560 250 0 "">\n'+
     '<780 290 780 290 "D" 790 250 0 "">\n'+
   '</Wires>\n'+
   '<Diagrams>\n'+
   '</Diagrams>\n'+
   '<Paintings>\n'+
   '</Paintings>'
   
   DCexample4[1].data = '<Qucs Schematic 0.0.19>\n'+
   '<Properties>\n'+
     '<View=0,-60,932,830,1,0,0>\n'+
     '<Grid=10,10,1>\n'+
     '<DataSet=Exemplo 4.dat>\n'+
     '<DataDisplay=Exemplo 4.dpl>\n'+
     '<OpenDisplay=1>\n'+
     '<Script=Exemplo 4.m>\n'+
     '<RunScript=0>\n'+
     '<showFrame=0>\n'+
     '<FrameText0=Título>\n'+
     '<FrameText1=Autor:>\n'+
     '<FrameText2=Data:>\n'+
     '<FrameText3=Revisão:>\n'+
   '</Properties>\n'+
   '<Symbol>\n'+
   '</Symbol>\n'+
   '<Components>\n'+
     '<IProbe Ir3 1 160 670 34 -9 0 3 "0 Ohm" 0>\n'+
     '<Vdc V2 1 160 570 18 -26 0 1 "5 V" 1 "0 Ohm" 0>\n'+
     '<IProbe Ir5 1 590 330 -10 16 0 0 "0 Ohm" 0>\n'+
     '<Vdc V3 1 310 110 -20 14 0 2 "12 V" 1 "0 Ohm" 0>\n'+
     '<Vdc V1 1 420 580 18 -26 0 1 "8 V" 1 "0 Ohm" 0>\n'+
     '<IProbe Ir1 1 420 480 13 -8 0 1 "0 Ohm" 0>\n'+
     '<IProbe Ir2 1 580 470 -35 -4 0 3 "0 Ohm" 0>\n'+
     '<GND * 1 500 770 0 0 0 0>\n'+
     '<IProbe Ir8 1 500 170 15 -8 0 1 "0 Ohm" 0>\n'+
     '<R R6 1 500 260 15 -26 0 1 "100 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R3 1 370 330 -26 -53 0 2 "40 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R1 1 580 580 15 -26 0 1 "25 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<R R2 1 160 450 15 -26 0 1 "10 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir7 1 160 190 16 -8 0 1 "0 Ohm" 0>\n'+
     '<R R7 1 640 110 -27 12 0 2 "60 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir9 1 850 180 -58 -9 0 1 "0 Ohm" 0>\n'+
     '<R R4 1 850 630 -92 -26 0 3 "30 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir4 1 850 510 -55 -9 0 1 "0 Ohm" 0>\n'+
     '<Idc I1 1 850 390 -62 -11 0 1 "0.5 A" 1 "0 Ohm" 0>\n'+
     '<R R5 1 740 330 -30 -49 0 0 "20 Ohm" 1 "26.85" 0 "0.0" 0 "0.0" 0 "26.85" 0 "US" 0>\n'+
     '<IProbe Ir6 1 260 330 -26 16 0 0 "0 Ohm" 0>\n'+
   '</Components>\n'+
   '<Wires>\n'+
     '<160 730 500 730 "" 0 0 0 "">\n'+
     '<160 700 160 730 "" 0 0 0 "">\n'+
     '<160 600 160 640 "" 0 0 0 "">\n'+
     '<160 480 160 540 "" 0 0 0 "">\n'+
     '<160 330 160 420 "" 0 0 0 "">\n'+
     '<400 330 500 330 "" 0 0 0 "">\n'+
     '<340 110 500 110 "" 0 0 0 "">\n'+
     '<420 510 420 550 "" 0 0 0 "">\n'+
     '<580 500 580 550 "" 0 0 0 "">\n'+
     '<420 610 420 660 "" 0 0 0 "">\n'+
     '<580 610 580 660 "" 0 0 0 "">\n'+
     '<580 400 580 440 "" 0 0 0 "">\n'+
     '<420 400 420 450 "" 0 0 0 "">\n'+
     '<420 660 500 660 "" 0 0 0 "">\n'+
     '<500 660 580 660 "" 0 0 0 "">\n'+
     '<500 660 500 730 "" 0 0 0 "">\n'+
     '<420 400 500 400 "" 0 0 0 "">\n'+
     '<500 330 560 330 "" 0 0 0 "">\n'+
     '<500 400 580 400 "" 0 0 0 "">\n'+
     '<500 330 500 400 "" 0 0 0 "">\n'+
     '<500 730 500 770 "" 0 0 0 "">\n'+
     '<500 290 500 330 "" 0 0 0 "">\n'+
     '<500 200 500 230 "" 0 0 0 "">\n'+
     '<500 110 500 140 "" 0 0 0 "">\n'+
     '<160 110 280 110 "" 0 0 0 "">\n'+
     '<160 110 160 160 "" 0 0 0 "">\n'+
     '<160 220 160 330 "" 0 0 0 "">\n'+
     '<500 110 610 110 "" 0 0 0 "">\n'+
     '<670 110 850 110 "" 0 0 0 "">\n'+
     '<850 110 850 150 "" 0 0 0 "">\n'+
     '<850 210 850 330 "" 0 0 0 "">\n'+
     '<500 730 850 730 "" 0 0 0 "">\n'+
     '<850 660 850 730 "" 0 0 0 "">\n'+
     '<850 540 850 600 "" 0 0 0 "">\n'+
     '<850 420 850 480 "" 0 0 0 "">\n'+
     '<850 330 850 360 "" 0 0 0 "">\n'+
     '<770 330 850 330 "" 0 0 0 "">\n'+
     '<620 330 710 330 "" 0 0 0 "">\n'+
     '<290 330 340 330 "" 0 0 0 "">\n'+
     '<160 330 230 330 "" 0 0 0 "">\n'+
     '<160 330 160 330 "B" 180 290 0 "">\n'+
     '<850 330 850 330 "D" 880 300 0 "">\n'+
     '<500 330 500 330 "A" 470 350 0 "">\n'+
     '<500 110 500 110 "C" 470 70 0 "">\n'+
   '</Wires>\n'+
   '<Diagrams>\n'+
   '</Diagrams>\n'+
   '<Paintings>\n'+
   '</Paintings>'
   
   

   

   //Images
   DCexample1[0].data ="data:image/png;base64,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";
   
   DCexample2[0].data = "data:image/png;base64,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";

   DCexample3[0].data = "data:image/png;base64,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";

   DCexample4[0].data = "data:image/png;base64,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";

   let allDCExamples = new Array();
   allDCExamples.push(DCexample1,DCexample2,DCexample3,DCexample4);

   if(ID.includes('D')){
      ID = ID.replace('D','');
      ID = parseInt(ID)-1;
      return allDCExamples[ID];
   }

   else
      return 0;
}



