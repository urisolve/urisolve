function getlatexsample(){
    var t = "\\documentclass[a4paper]{article}\r\n\\usepackage{graphicx}\r\n\\usepackage[latin1]{inputenc}\r\n\\usepackage{amsmath}\r\n\\usepackage{fancyhdr}\r\n\\pagestyle{fancy}\r\n\\lhead{\\textsc{URIsolve App}}\r\n\\rhead{\\textsc{Node Voltage Method (Supernode approach)}}\r\n\\cfoot{www.isep.ipp.pt}\r\n\\lfoot{DEE - ISEP}\r\n\\rfoot {\\thepage}\r\n\\renewcommand{\\headrulewidth}{0.4pt}\r\n\\renewcommand{\\footrulewidth}{0.4pt}\r\n\r\n\\title{\r\n\\raisebox{-.2\\height}{\\includegraphics[height=1cm, keepaspectratio]{logo}} URIsolve APP \\\\\r\n\\newline\r\n\\textsc{Node Voltage Method} \\\\\r\n\\textsc{(Supernode approach)} \\\\\r\nStep by Step Solution \\\\\r\n\\vspace*{1\\baselineskip}\r\n}\r\n\r\n\\author{\r\n\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}\r\nLino Sousa           & M\u00E1rio Alves          \\\\\r\n1140355@isep.ipp.pt  & mjf@isep.ipp.pt      \\\\\r\n\t\t\t\t\t &                      \\\\\r\nAndr\u00E9 Rocha          & Francisco Pereira    \\\\\r\nanr@isep.ipp.pt      & fdp@isep.ipp.pt      \\\\\r\n\\end{tabular}\r\n}\r\n\r\n\\date{}\r\n\r\n\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\nThis document provides a step by step solution for the submitted circuit, using the Node Voltage Method (NVM). If possible, it's implemented the Supernode approach to simplify the circuit analysis.\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n\\section{Circuit Image}\r\n\r\n\\begin{figure}[hbt]\r\n\\centering{\\includegraphics[height=12cm, keepaspectratio]{circuit}}\r\n\\caption{Circuit image}\r\n\\label{circuitimage}\r\n\\end{figure}\r\n\r\n\\section{Circuit Information}\r\n\r\n\\begin{table}[h!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n\\textbf{Frequency {[}F{]}} &  & \\textbf{Current Sources {[}I{]}} &  & \\textbf{Ammeters {[}A{]}} &  & \\textbf{Simulation {[}AC\/DC{]}} \\\\\r\nF=1GHz                     &  & I=1                              &  & 15\/15                     &  & AC\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\section{Fundamental Variables}\r\n\r\n\\begin{table}[hbt!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n\\textbf{Branches {[}R{]}} &  & \\textbf{Nodes {[}N{]}} &  & \\textbf{Isolated Voltage Sources {[}T{]}} &  & \\textbf{Equations {[}E{]}} \\\\\r\nR=15                      &  & N=9                    &  & T=6                                       &  & E=N-T-1=2\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\section{Supernodes}\r\n\r\n\\subsection{Floating}\r\n\r\n\\subsubsection{SNf1}\r\n\r\n\r\n\\paragraph{} Formed by Nodes: {A, B, E, J, H, D}\r\n\\par\r\n\r\n\\paragraph{} Equations:\r\n\r\n\\begin{gather*}\r\n\\begin{cases}\r\nV_{B} = \\mathrm{V_{A}}-5\\\\V_{E} = \\mathrm{V_{A}}-4\\\\V_{J} = \\mathrm{V_{A}}-13\\\\V_{H} = \\mathrm{V_{A}}-13\\cdot\\left( i+1\\right)\\\\V_{D} = \\mathrm{V_{A}}-4\\\\\r\n\\end{cases}\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} Steps:\r\n\r\n\\begin{gather*}\r\n\\begin{cases}V_{B} = \\mathrm{V_{A}}- V2\\\\[0.7em] V_{D} = \\mathrm{V_{A}}- V3\\\\[0.7em] V_{E} = \\mathrm{V_{A}}- V2+ V12\\\\[0.7em] V_{J} = \\mathrm{V_{A}}- V6- V2+ V12\\\\[0.7em] V_{H} = - V2- V10- V6+\\mathrm{V_{A}}+ V12\\end{cases}\r\n\\end{gather*}\r\n\r\n\\subsubsection{SNf2}\r\n\r\n\\paragraph{} Formed by Nodes: {T, M}\r\n\\par\r\n\r\n\\paragraph{} Equations:\r\n\r\n\\begin{gather*}\r\n\\begin{cases}\r\nV_{M} = \\mathrm{V_{T}}-1\r\n\\end{cases}\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} Steps:\r\n\r\n\\begin{gather*}\r\n\\begin{cases}V_{M} = \\mathrm{V_{T}}- V11\\end{cases}\r\n\\end{gather*}\r\n\\par\r\n\r\n\\subsection{Grounded}\r\nNot found in this circuit.\r\n\r\n\\newpage\r\n\\section{Circuit Currents}\r\n\r\n\\subsection{General information}\r\n\r\n\\begin{table}[ht]\r\n\\caption{List of the circuit currents and its properties\/components}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\nI01                & A                   & GND               & V1, L1, V7          \\\\\r\nI02                & GND                 & B                 & R6                  \\\\\r\nI03                & GND                 & H                 & C1, I3, R7          \\\\\r\nI04                & A                   & B                 & V2                  \\\\\r\nI05                & B                   & H                 & R4                  \\\\\r\nI06                & H                   & J                 & V10                 \\\\\r\nI07                & B                   & E                 & V12                 \\\\\r\nI08                & A                   & D                 & V3                  \\\\\r\nI09                & D                   & T                 & R1                  \\\\\r\nI10                & E                   & T                 & R10, C2             \\\\\r\nI11                & T                   & M                 & R2                  \\\\\r\nI12                & J                   & M                 & R3                  \\\\\r\nI13                & D                   & E                 & R9                  \\\\\r\nI14                & E                   & J                 & V6                  \\\\\r\nI15                & T                   & M                 & V11\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\subsection{Equivalent Impedances and Voltages}\r\n\\paragraph{} Branch from A to gnd\r\n\\begin{gather*}\r\n\\begin{cases}\r\nVeqAgnd =  - V1 - V7 = -11\\;V\r\n\\end{cases}\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} Branch from D to T\r\n\\begin{gather*}\r\n\\begin{cases}\r\nVeqDT =  - V4 - V5 = -8\\;V\r\n\\end{cases}\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} Branch from E to T\r\n\\begin{gather*}\r\n\\begin{cases}\r\nZeqgndH = R10 + C2  = 50 - 159.155i\\;\\Omega\r\n\\end{cases}\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} Branch from gnd to H\r\n\\begin{gather*}\r\n\\begin{cases}\r\nZeqgndH = C1 + R7  = 5 - 159.155i\\;\\Omega\r\n\\end{cases}\r\n\\end{gather*}\r\n\\par\r\n\\newpage\r\n\\subsection{Equations}\r\nEquations using the Kirchhoff Nodes Law (KNL)\r\n\r\n\\subsubsection{Node SNf1}\r\n\\begin{figure}[hbt]\r\n\\centering{\\includegraphics[height=4cm, keepaspectratio]{snf1}}\r\n\\caption{Node SNf1 currents}\r\n\\label{snf1currents}\r\n\\end{figure}\r\n\\begin{equation}\r\n  I01+I09+I10+I12=I02+I03\r\n\\end{equation}\r\n\r\n\\subsubsection{Node SNf2}\r\n\\begin{figure}[hbt]\r\n\\centering{\\includegraphics[height=4cm, keepaspectratio]{snf2}}\r\n\\caption{Node SNf2 currents}\r\n\r\n\\label{snf2currents}\r\n\\end{figure}\r\n\\begin{equation}\r\n  I09+I10+I12=0\r\n\\end{equation}\r\n\r\n\\newpage\r\n\\section{Equation System}\r\n\r\n\\paragraph{} Equations:\r\n\\begin{gather*}\r\n\\begin{cases}\\frac{\\left(\\mathrm{V_{A}}- V1- V7\\right)}{ XL1}+\\left(\\frac{\\mathrm{V_{B}}}{ R6}\\right)+\\frac{\\left( V_{D}- V4- V5-\\mathrm{V_{T}}\\right)}{ R1}+\\frac{\\left( V_{E}-\\mathrm{V_{T}}\\right)}{ XC2}+\\frac{\\left(\\mathrm{V_{J}}- V_{M}\\right)}{ R3}-0.001 = 0 \\\\[0.7em] \\frac{\\left( V_{D}- V4- V5-\\mathrm{V_{T}}\\right)}{ R1}+\\frac{\\left( V_{E}-\\mathrm{V_{T}}\\right)}{ XC2}+\\frac{\\left(\\mathrm{V_{J}}- V_{M}\\right)}{ R3} = 0\\end{cases}\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} Steps:\r\n\r\n%\\hfill\\begin{minipage}{\\dimexpr\\textwidth-1cm}\r\n\\begin{small}\\textbf{\\textit{Step 1:}}\\end{small}  Reorder current equations\r\n\\begin{gather*}\r\n\\begin{cases}I01 - I02 + I09 + I10 + I12 - I03 = 0 \\\\[0.7em] I09 + I10 + I12 = 0\\end{cases}\r\n\\end{gather*}\r\n\r\n\\begin{small}\\textbf{\\textit{Step 2:}}\\end{small}  Substitute the known currents\r\n\\begin{gather*}\r\n\\begin{cases}I01 - I02 + I09 + I10 + I12 - 0.001 = 0 \\\\[0.7em] I09 + I10 + I12 = 0\\end{cases}\r\n\\end{gather*}\r\n\r\n\\begin{small}\\textbf{\\textit{Step 3:}}\\end{small}  Compute the remaining currents using Ohm's Law\r\n\\begin{gather*}\r\n\\begin{cases}I01 = \\frac{\\left(\\mathrm{V_{A}}- V1 -  V7\\right)}{ XL1} \\\\[0.7em] I02 = -\\left(\\frac{\\mathrm{V_{B}}}{ R6}\\right) \\\\[0.7em] I09 = \\frac{\\left( V_{D}- V4 -  V5 - \\mathrm{V_{T}}\\right)}{ R1} \\\\[0.7em] I10 = \\frac{\\left( V_{E}-\\mathrm{V_{T}}\\right)}{ XC2} \\\\[0.7em] I12 = \\frac{\\left(\\mathrm{V_{J}}- V_{M}\\right)}{ R3}\\end{cases}\r\n\\end{gather*}\r\n\r\n\\begin{small}\\textbf{\\textit{Step 4:}}\\end{small}  Substitute each current by its equation\r\n\\begin{gather*}\r\n\\begin{cases}\\frac{\\left(\\mathrm{V_{A}}- V1- V7\\right)}{ XL1}+\\left(\\frac{\\mathrm{V_{B}}}{ R6}\\right)+\\frac{\\left( V_{D}- V4- V5-\\mathrm{V_{T}}\\right)}{ R1}+\\frac{\\left( V_{E}-\\mathrm{V_{T}}\\right)}{ XC2}+\\frac{\\left(\\mathrm{V_{J}}- V_{M}\\right)}{ R3}-0.001 = 0 \\\\[0.7em] \\frac{\\left( V_{D}- V4- V5-\\mathrm{V_{T}}\\right)}{ R1}+\\frac{\\left( V_{E}-\\mathrm{V_{T}}\\right)}{ XC2}+\\frac{\\left(\\mathrm{V_{J}}- V_{M}\\right)}{ R3} = 0\\end{cases}\r\n\\end{gather*}\r\n\r\n\\begin{small}\\textbf{\\textit{Step 5:}}\\end{small}  Replace the constants with their value\r\n\\begin{gather*}\r\n\\begin{cases}\\frac{\\mathrm{V_{A}}-11}{\\frac{ i\\cdot62830}{10000}}+\\frac{\\mathrm{V_{B}}}{12}+\\frac{-8-\\mathrm{V_{T}}+ V_{D}}{20}+\\frac{ V_{E}-\\mathrm{V_{T}}}{\\frac{ i\\cdot-7.9577\\cdot10^{+7}}{5\\cdot10^{+5}}}+\\frac{\\mathrm{V_{J}}- V_{M}}{30}+\\frac{-1}{1000} = 0 \\\\[0.7em] \\frac{-8-\\mathrm{V_{T}}+ V_{D}}{20}+\\frac{ V_{E}-\\mathrm{V_{T}}}{\\frac{ i\\cdot-7.9577\\cdot10^{+7}}{5\\cdot10^{+5}}}+\\frac{\\mathrm{V_{J}}- V_{M}}{30} = 0\\end{cases}\r\n\\end{gather*}\r\n\r\n\\begin{small}\\textbf{\\textit{Step 6:}}\\end{small} Set a reference for each floating supernode\r\n\\newline\r\nIn supernode SNf1 the node A was chosen as a reference. \\\\\r\nIn supernode SNf2 the node T was chosen as a reference.\r\n\r\n\\newline\r\n\\begin{footnotesize}\r\n\\textbf{\\textit{Notes:}} \\\\\r\nThe voltage of each node from a floating supernode must be expressed as a function of the reference node. \\\\\r\nIn the Supernodes section, you can confirm that node equations are already referenced to the chosen node. \\\\\r\nUse these expressions to perform the substitution in the equation system.\r\n\\end{footnotesize}\r\n\r\n\r\n%\\end{minipage}\r\n\\par\r\n\r\n\\newpage\r\n\r\n\\section{Results}\r\n\r\n\\subsection{Node Voltages}\r\n\\begin{gather*}\r\n\\begin{cases}V_{A} = 9.712-2.461i\\;V \\\\[0.7em] V_{T} = -2.243-1.861i\\;V \\\\[0.7em] V_{B} = 4.712-2.461i\\;V \\\\[0.7em] V_{D} = 5.712-2.461i\\;V \\\\[0.7em] V_{M} = -3.243-1.861i\\;V \\\\[0.7em] V_{E} = 5.712-2.461i\\;V \\\\[0.7em] V_{J} = -3.288-2.461i\\;V \\\\[0.7em] V_{H} = -3.288-15.461i\\;V\\end{cases}\r\n\\end{gather*}\r\n\r\n\\subsection{Circuit Currents}\r\n\\begin{gather*}\r\n\\begin{cases}I03 = 0.001\\;A\\end{cases}\r\n\\end{gather*}\r\n\\begin{footnotesize}\r\n\\textbf{\\textit{Note:}} \\\\\r\nCurrents were obtained by an existing current source in their branch.\r\n\\end{footnotesize}\r\n\r\n\\begin{gather*}\r\n\\begin{cases}I01 = \\frac{\\mathrm{V_{A}}-11}{\\frac{ i\\cdot1.256\\cdot10^{+7}}{2\\cdot10^{+6}}} \\\\[0.7em] I05 = \\frac{\\mathrm{V_{B}}-\\mathrm{V_{H}}}{10} \\\\[0.7em] I02 = \\frac{\\mathrm{V_{B}}\\cdot-1}{12} \\\\[0.7em] I13 = \\frac{ V_{D}- V_{E}}{25} \\\\[0.7em] I09 = \\frac{-8-\\mathrm{V_{T}}+ V_{D}}{20} \\\\[0.7em] I10 = \\frac{ V_{E}-\\mathrm{V_{T}}}{-\\left(159.154\\cdot i\\right)} \\\\[0.7em] I12 = \\frac{\\mathrm{V_{J}}- V_{M}}{30} \\\\[0.7em] I11 = \\frac{\\mathrm{V_{T}}- V_{M}}{20}\\end{cases} \\Leftrightarrow\\large \\begin{cases}I01 = -0.392\\;A \\\\[0.7em] I05 = 0.8\\;A \\\\[0.7em] I02 = -0.393\\;A \\\\[0.7em] I13 = 0\\;A \\\\[0.7em] I09 = -0.002\\;A \\\\[0.7em] I10 = 0.004\\;A \\\\[0.7em] I12 = -0.002\\;A \\\\[0.7em] I11 = 0.05\\;A\\end{cases}\r\n\\end{gather*}\r\n\\begin{footnotesize}\r\n\\textbf{\\textit{Note:}} \\\\\r\nCurrents were obtained by their Ohm's Law equation.\r\n\\end{footnotesize}\r\n\r\n\\begin{gather*}\r\n\\begin{cases}I08 = I13 + I09 \\\\[0.7em] I06 = I05 + I03 \\\\[0.7em] I15 = -I12 - I11 \\\\[0.7em] I04 = -I01 - I08 \\\\[0.7em] I07 = -I05 + I04 + I02 \\\\[0.7em] I14 = -I10 + I07 + I13\\end{cases} \\Leftrightarrow\\large \\begin{cases}I08 = -0.002\\;A \\\\[0.7em] I06 = 0.801\\;A \\\\[0.7em] I15 = -0.048\\;A \\\\[0.7em] I04 = 0.394\\;A \\\\[0.7em] I07 = -0.799\\;A \\\\[0.7em] I14 = -0.803\\;A\\end{cases}\r\n\\end{gather*}\r\n\\begin{footnotesize}\r\n\\textbf{\\textit{Note:}} \\\\\r\nCurrents were obtained by their KNL equation, since they belong to branches with isolated voltage sources.\r\n\\end{footnotesize}\r\n\r\n\\end{document}\r\n";
    return t;
};