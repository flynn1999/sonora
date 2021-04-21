export default {
    description:
        "Tuexdo suite of tools to assess levels of differential expression between up to 4 separate conditions. The Tuxedo suite: Tophat2>Cufflinks>Cuffmerge>Cuffdiff>CummRbund. http://www.nature.com/nprot/journal/v7/n3/full/nprot.2012.016.html \nworkflow v1.0\n",
    requirements: [
        {
            step_number: 0,
        },
    ],
    deleted: false,
    disabled: false,
    name: "Tuxedo suite PE up to 4 conditions",
    system_id: "de",
    label: "Tuxedo suite PE up to 4 conditions",
    id: "75fb1acc-6e66-11e5-b4e0-2f3df1a4e3ed",
    app_type: "DE",
    groups: [
        {
            id: "763de3de-6e66-11e5-8784-7bdaec7f08d0",
            name: "",
            label: "README",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label:
                        "This workflow carries out differential expression analysis using the Tuxedo suite of tools. In this workflow: TopHat v2.0.9,  Cufflinks package (including Cuffmerge and Cuffdiff) v2.2.1 and CummeRbund 2.4.1-1.\n",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_76472228-6e66-11e5-8c9a-f741cee619e9",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label:
                        "Input files required: \n1) Paired end sequencing RNA-seq reads for each condition/replicate\n2) A reference genome in Fasta format OR select reference genome hosted on iPlant  from drop down menu\n3) A genome annotation file in GFF3 or GTF2 format (http://cole-trapnell-lab.github.io/cufflinks/file_formats/) OR select annotation hosted on iPlant from drop down menu\n4) OPTIONAL- GTF masking file (containing transcripts to be ignored)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_4b8c29c4-9815-11e5-b7db-23974484005d",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label:
                        "General settings: \nThe tool settings in the app below can be changed but are set as the default values (as dictated by each program in the workflow). If you are using the Tuxedo suite of tools for the first time we recommend using the default values in the first instance. ",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_4b8c8b80-9815-11e5-921a-a39c033c7167",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label:
                        "Program manuals:\nTophat https://ccb.jhu.edu/software/tophat/manual.shtml\n Cufflinks-Cuffdiff http://cole-trapnell-lab.github.io/cufflinks/manual/\nCummeRbund http://compbio.mit.edu/cummeRbund/manual_2_0.html\n",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_4b8ce3d2-9815-11e5-a41d-73c5c0c70ce5",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label: "",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_7647e24e-6e66-11e5-9e01-7bbe156261e2",
                    isVisible: true,
                    required: false,
                },
            ],
            step_number: 0,
        },
        {
            id: "76484374-6e66-11e5-b440-b327a0273baa",
            name: "",
            label: "Input data",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label:
                        "Enter each replicate for each condition in the boxed below:\nThere should be two FASTQ files for each set of paired-end reads.\nLeft and right reads have separate input boxes. Scroll down to input read files.\n",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_7651a888-6e66-11e5-9340-33a25c1142a0",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label:
                        'IMPORTANT: If you are entering multiple replicates for each condition, enter each replicates left reads file for condition 1 into "Left Read File(s):", then enter each replicates right reads file into "Right Read File(s):" in the SAME order. Repeat this for each condition. ',
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_5b16a58e-9817-11e5-9587-23209c362d32",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "Enter an identifier for this condition - **Use _ instead of spaces** e.g. 2_hours",
                    arguments: [],
                    name: "-lab1",
                    type: "Text",
                    validators: [],
                    label:
                        "Condition 1 label (for R plots, use underscore instead of spaces between words)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_765252ba-6e66-11e5-b83b-430da6c5c53c",
                    isVisible: true,
                    defaultValue: "condition_1",
                    required: true,
                },
                {
                    description:
                        "Enter the left reads (R1) for all condition 1 replicates",
                    arguments: [],
                    name: "-input1",
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Condition 1- Left Read File(s)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_76530c6e-6e66-11e5-8935-378986ecf6a3",
                    isVisible: true,
                    required: true,
                },
                {
                    description:
                        "Enter the left reads (R2) for all condition 1 replicates in the same sample order as for R1",
                    arguments: [],
                    name: "-input2",
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Condition 1- Right Read File(s)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_7657eb12-6e66-11e5-9b6d-eb978ab30f18",
                    isVisible: true,
                    required: true,
                },
                {
                    description:
                        "Enter an identifier for this condition - **Use _ instead of spaces** e.g. 2_hours",
                    arguments: [],
                    name: "-lab2",
                    type: "Text",
                    validators: [],
                    label:
                        "Condition 2 label (for R plots, use underscore instead of spaces between words)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_7659bb9a-6e66-11e5-9396-dfe61ae1095c",
                    isVisible: true,
                    defaultValue: "condition_2",
                    required: false,
                },
                {
                    description:
                        "Enter the left reads (R1) for all condition 2 replicates",
                    arguments: [],
                    name: "-input3",
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Condition 2- Left Read File(s)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_765a74c2-6e66-11e5-817b-2f9efe114e44",
                    isVisible: true,
                    required: true,
                },
                {
                    description:
                        "Enter the left reads (R2) for all condition 2 replicates in the same sample order as for R1",
                    arguments: [],
                    name: "-input4",
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Condition 2- Right Read File(s)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_765c8eb0-6e66-11e5-82b8-dbb9529dd002",
                    isVisible: true,
                    required: true,
                },
                {
                    description:
                        "Enter an identifier for this condition - **Use _ instead of spaces** e.g. 2_hours",
                    arguments: [],
                    name: "-lab3",
                    type: "Text",
                    validators: [],
                    label:
                        "Condition 3 label (for R plots, use underscore instead of spaces between words)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_765e9034-6e66-11e5-8c16-fbe584a86f83",
                    isVisible: true,
                    defaultValue: "condition_3",
                    required: false,
                },
                {
                    description:
                        "Enter the left reads (R1) for all condition 3 replicates",
                    arguments: [],
                    name: "-input5",
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Condition 3- Left Read File(s)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_765f3fd4-6e66-11e5-b681-2b1be581e4b0",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "Enter the left reads (R2) for all condition 3 replicates in the same sample order as for R1",
                    arguments: [],
                    name: "-input6",
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Condition 3- Right Read File(s)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_7661184a-6e66-11e5-81e0-7be174626983",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "Enter an identifier for this condition - **Use _ instead of spaces** e.g. 2_hours",
                    arguments: [],
                    name: "-lab4",
                    type: "Text",
                    validators: [],
                    label:
                        "Condition 4 label (for R plots, use underscore instead of spaces between words)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_7662ea80-6e66-11e5-9982-733997f7132c",
                    isVisible: true,
                    defaultValue: "condition_4",
                    required: false,
                },
                {
                    description:
                        "Enter the left reads (R1) for all condition 4 replicates",
                    arguments: [],
                    name: "-input7",
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Condition 4- Left Read File(s)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_766389a4-6e66-11e5-aa40-0fc7420590ff",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "Enter the left reads (R2) for all condition 3 replicates in the sample order as for R1",
                    arguments: [],
                    name: "-input8",
                    type: "MultiFileSelector",
                    validators: [],
                    label: "Condition 4- Right Read File(s)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_76656882-6e66-11e5-83f1-0b0e5bcbd82a",
                    isVisible: true,
                    required: false,
                },
            ],
            step_number: 0,
        },
        {
            id: "7666f36e-6e66-11e5-ab7b-674a4670e26f",
            name: "",
            label: "Reference Genome (Mandatory)",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label:
                        "Select a reference genome from the list or select your own reference genome file.  Note one of these two options MUST be selected.  ",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_766b19d0-6e66-11e5-969e-337d7bbf07d4",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "Select a reference genome for your reads to be mapped against",
                    arguments: [],
                    name: "-indx",
                    type: "ReferenceSequence",
                    validators: [],
                    label: "Select a reference genome from the list",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_766bcb46-6e66-11e5-9f78-63d0c98b225f",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label:
                        "If your species is not in the pull-down menu, try 'Community Data'->iplant_training->reference_genomes.  It contains a larger collection.  You may also provide your own reference genome in FASTA format.",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_7670a314-6e66-11e5-81ed-2be7e72c8eb4",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "enter your own reference sequence file in fasta format",
                    arguments: [],
                    name: "-indx",
                    type: "FileInput",
                    validators: [],
                    label: "Provide a reference genome file in FASTA format",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_767150fc-6e66-11e5-8fb3-874070944eba",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "enter the prefix you would like your index files to have (excluding suffix .bt2 etc.) ",
                    arguments: [],
                    name: "-indpre",
                    type: "Text",
                    validators: [],
                    label: "Index file prefix (use underscore between words)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_76733dcc-6e66-11e5-a5fc-5721897a1b5d",
                    isVisible: true,
                    defaultValue: "index_name",
                    required: true,
                },
            ],
            step_number: 0,
        },
        {
            id: "76763f40-6e66-11e5-b560-b74ca3a3182a",
            name: "",
            label: "Reference Annotations",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label:
                        "Select reference genome annotations from the list or select your own reference genome file (GTF/GFF).  This will help Tophat find known splice junctions.",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_7679c58e-6e66-11e5-91d7-a3f3e691a0ad",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-gtf",
                    type: "ReferenceAnnotation",
                    validators: [],
                    label: "Select Reference Annotations",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_767a6eda-6e66-11e5-b70f-e76ed5e6137d",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "",
                    type: "Info",
                    validators: [],
                    label: "       --OR--",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_767c5f2e-6e66-11e5-bb49-cfafed9c900a",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "Enter your own annotation file in GTF/GFF3 format",
                    arguments: [],
                    name: "-gtf",
                    type: "FileInput",
                    validators: [],
                    label: "Provide a reference annotation file (GTF/GFF)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_767d056e-6e66-11e5-86be-9f40f3e940cd",
                    isVisible: true,
                    required: false,
                },
            ],
            step_number: 0,
        },
        {
            id: "767e960e-6e66-11e5-970d-473f3f6e239e",
            name: "",
            label: "Tophat2 Analysis Options",
            parameters: [
                {
                    description:
                        "Select a scale for quality values in FASTQ files",
                    arguments: [
                        {
                            name: " ",
                            isDefault: false,
                            id: "7688b486-6e66-11e5-9e42-23271c5d8251",
                            display: "Sanger (PHRED33)",
                            value: "",
                        },
                        {
                            name: "-g",
                            isDefault: false,
                            id: "76891174-6e66-11e5-80a6-2fa01dc1c120",
                            display: "Illumina 1.3-1.8 (PHRED64)",
                            value: "",
                        },
                        {
                            name: " ",
                            isDefault: true,
                            id: "76895fda-6e66-11e5-a420-cf01eac7bc69",
                            display: "Illumina 1.9 (PHRED33)",
                            value: "",
                        },
                        {
                            name: "-g",
                            isDefault: false,
                            id: "7689b69c-6e66-11e5-a934-131b73be3e25",
                            display: "Solexa1.3 (PHRED64)",
                            value: "",
                        },
                    ],
                    name: "",
                    type: "TextSelection",
                    validators: [],
                    label: "FASTQ Quality Scale",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_768854b4-6e66-11e5-b48a-43734dbc3d4f",
                    isVisible: true,
                    defaultValue: {
                        id: "76895fda-6e66-11e5-a420-cf01eac7bc69",
                        name: " ",
                        value: "",
                        display: "Illumina 1.9 (PHRED33)",
                        isDefault: true,
                    },
                    required: true,
                },
                {
                    description:
                        "Select the library type that was used to construct your RNA-seq data",
                    arguments: [
                        {
                            name: "-e",
                            isDefault: true,
                            id: "768abbdc-6e66-11e5-a502-13343db5ecfd",
                            display: "fr-unstranded",
                            value: "fr-unstranded",
                        },
                        {
                            name: "-e",
                            isDefault: false,
                            id: "768b151e-6e66-11e5-819f-67b3cbe7e786",
                            display: "fr-firststrand",
                            value: "fr-firststrand",
                        },
                        {
                            name: "-e",
                            isDefault: false,
                            id: "768b691a-6e66-11e5-a862-9ff7aedc1f11",
                            display: "fr-secondstrand",
                            value: "fr-secondstrand",
                        },
                    ],
                    name: "",
                    type: "TextSelection",
                    validators: [],
                    label: "Library Type",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_768a67ae-6e66-11e5-90e8-478610c63094",
                    isVisible: true,
                    defaultValue: {
                        id: "768abbdc-6e66-11e5-a502-13343db5ecfd",
                        name: "-e",
                        value: "fr-unstranded",
                        display: "fr-unstranded",
                        isDefault: true,
                    },
                    required: true,
                },
                {
                    description:
                        "Select the speed/sensitivity of alignment/mapping ",
                    arguments: [
                        {
                            name: "-f",
                            isDefault: false,
                            id: "768c5c26-6e66-11e5-935a-87918d7378f1",
                            display: "Very Sentive (slowest)",
                            value: "4",
                        },
                        {
                            name: "-f",
                            isDefault: true,
                            id: "768ca9c4-6e66-11e5-aa17-c71e614c5f38",
                            display: "Sensitive (slower)",
                            value: "3",
                        },
                        {
                            name: "-f",
                            isDefault: false,
                            id: "768cfab4-6e66-11e5-9ae8-affe77d2b698",
                            display: "Fast (less sensitive)",
                            value: "2",
                        },
                        {
                            name: "-f",
                            isDefault: false,
                            id: "768d4b9a-6e66-11e5-98d1-c732fb460b40",
                            display: "Very fast (least sensitive)",
                            value: "1",
                        },
                    ],
                    name: "",
                    type: "TextSelection",
                    validators: [],
                    label: "Bowtie 2 speed and sensitivity",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_768c0cee-6e66-11e5-b65b-9fef25f3af80",
                    isVisible: true,
                    defaultValue: {
                        id: "768ca9c4-6e66-11e5-aa17-c71e614c5f38",
                        name: "-f",
                        value: "3",
                        display: "Sensitive (slower)",
                        isDefault: true,
                    },
                    required: true,
                },
                {
                    description:
                        'Select the "Insert" size, the distance between the sequenced forward and reverse reads (-r)',
                    arguments: [],
                    name: "-a",
                    type: "Integer",
                    validators: [],
                    label: "Mate-Pair Inner Distance",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_768de1f4-6e66-11e5-b7eb-73b490296e34",
                    isVisible: true,
                    defaultValue: "50",
                    required: true,
                },
                {
                    description:
                        "The standard deviation for the distribution on inner distances between mate pairs (--mate-std-dev)",
                    arguments: [],
                    name: "-b",
                    type: "Text",
                    validators: [],
                    label: "Mate inner distance standard deviation",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_768ec506-6e66-11e5-afd5-d746129481e3",
                    isVisible: true,
                    required: false,
                },
                {
                    description:
                        "TopHat will report junctions spanned by reads with at least this many bases on each side of the junction (-a)",
                    arguments: [],
                    name: "-i",
                    type: "Integer",
                    validators: [
                        {
                            type: "IntAbove",
                            params: [2],
                        },
                    ],
                    label: "Minimum anchor length",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_768f6524-6e66-11e5-827f-6f0b4ee6e0b3",
                    isVisible: true,
                    defaultValue: "8",
                    required: true,
                },
                {
                    description:
                        "The minimum intron length. TopHat will ignore donor/acceptor pairs closer than this many bases apart (-i)",
                    arguments: [],
                    name: "-k",
                    type: "Integer",
                    validators: [
                        {
                            type: "IntAbove",
                            params: [-1],
                        },
                    ],
                    label: "The minimum intron length",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_779b859c-6e66-11e5-a072-372b4c9c3afe",
                    isVisible: true,
                    defaultValue: "70",
                    required: true,
                },
                {
                    description:
                        "The maximum intron length. When searching for junctions ab initio, TopHat will ignore donor/acceptor pairs farther than this many bases apart, except when such a pair is supported by a split segment alignment of a long read (-I)",
                    arguments: [],
                    name: "-l",
                    type: "Integer",
                    validators: [
                        {
                            type: "IntAbove",
                            params: [-1],
                        },
                    ],
                    label: "The maximum intron length",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_779da944-6e66-11e5-8d38-d3d36214f172",
                    isVisible: true,
                    defaultValue: "50000",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-j",
                    type: "Integer",
                    validators: [],
                    label: "Maximum number of alignments to be allowed",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_779fcecc-6e66-11e5-86cb-1b816e328279",
                    isVisible: true,
                    defaultValue: "20",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-m",
                    type: "Integer",
                    validators: [],
                    label: "Minimum length of read segments",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77a0dc9a-6e66-11e5-b49e-9b9c4f5bf5e6",
                    isVisible: true,
                    defaultValue: "20",
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-c, ",
                    type: "Flag",
                    validators: [],
                    label: "No discordant alignments",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77a2ef26-6e66-11e5-b20b-e3f7d3a741a7",
                    isVisible: true,
                    defaultValue: "false",
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-d, ",
                    type: "Flag",
                    validators: [],
                    label: "No mixed alignments ",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77a3fe48-6e66-11e5-ab33-e35ffc8c3dfb",
                    isVisible: true,
                    defaultValue: "false",
                    required: false,
                },
            ],
            step_number: 0,
        },
        {
            id: "77a6f576-6e66-11e5-95f5-ef8725196612",
            name: "",
            label: "Cufflinks analysis options",
            parameters: [
                {
                    description:
                        "Cufflinks will use transcripts found in the annotation file (gtf) as a basis for the assembly of transcripts",
                    arguments: [],
                    name: "-n, ",
                    type: "Flag",
                    validators: [],
                    label: "Use GTF to guide assembly ",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77b3ba86-6e66-11e5-94e8-cf29adc8c732",
                    isVisible: true,
                    defaultValue: "true",
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-o",
                    type: "FileInput",
                    validators: [],
                    label:
                        "Optional- Masking file containing transcripts to be ignored (GTF)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77b4c426-6e66-11e5-ae2d-835e0a30b860",
                    isVisible: true,
                    required: false,
                },
                {
                    description: " ",
                    arguments: [],
                    name: "-p, ",
                    type: "Flag",
                    validators: [],
                    label: "Use rescue method for multi-reads",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77b6bfce-6e66-11e5-9ef3-eb5d6fba4d1a",
                    isVisible: true,
                    defaultValue: "false",
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-Q",
                    type: "Integer",
                    validators: [],
                    label: "Maximum iterations allowed for MLE calculation",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77b7bfd2-6e66-11e5-836e-4776a3a5e591",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-q",
                    type: "Text",
                    validators: [],
                    label: "Transcript prefix id",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77b86e6e-6e66-11e5-8fba-0bb777f9cf94",
                    isVisible: true,
                    defaultValue: "CUFF",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-s",
                    type: "Double",
                    validators: [],
                    label: "Minimum isoform fraction",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77b96dd2-6e66-11e5-8511-37f72c490739",
                    isVisible: true,
                    defaultValue: "0.100000000000000006",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-t",
                    type: "Double",
                    validators: [],
                    label:
                        "Suppress intra-intronic transcripts below this level",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77ba71aa-6e66-11e5-a5a9-0bc48d10cc9f",
                    isVisible: true,
                    defaultValue: "0.149999999999999994",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-u",
                    type: "Integer",
                    validators: [],
                    label: "Maximum intron length",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77bb715e-6e66-11e5-9cf8-8f1f49e6a943",
                    isVisible: true,
                    defaultValue: "300000",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-z",
                    type: "Integer",
                    validators: [],
                    label: "Minimum intron length",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77bc6ae6-6e66-11e5-82d5-5b2b4070af97",
                    isVisible: true,
                    defaultValue: "50",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-v",
                    type: "Double",
                    validators: [],
                    label: "Alpha for junction binomial test filter",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77bd6b12-6e66-11e5-8e86-5fe540333786",
                    isVisible: true,
                    defaultValue: "0.00100000000000000002",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-w",
                    type: "Double",
                    validators: [],
                    label: "Small anchor fraction",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77be586a-6e66-11e5-88c0-efb67eefe484",
                    isVisible: true,
                    defaultValue: "0.0899999999999999967",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-x",
                    type: "Integer",
                    validators: [],
                    label:
                        "Minimum number of fragments needed for new transfrags",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77bf4b76-6e66-11e5-9d20-070d6bd24c77",
                    isVisible: true,
                    defaultValue: "10",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-y",
                    type: "Integer",
                    validators: [],
                    label: "Number of terminal exon bp to tolerate in introns",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77c04724-6e66-11e5-9187-bfb7ecf4b591",
                    isVisible: true,
                    defaultValue: "8",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-A",
                    type: "Integer",
                    validators: [],
                    label:
                        "Minimum average coverage required to attempt 3' trimming",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77c14dea-6e66-11e5-8919-374b147ed8cb",
                    isVisible: true,
                    defaultValue: "10",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-B",
                    type: "Double",
                    validators: [],
                    label:
                        "Fraction of average coverage below which to trim 3' end",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77c25a28-6e66-11e5-8ba6-5bd5fef6843b",
                    isVisible: true,
                    defaultValue: "0.100000000000000006",
                    required: true,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-C",
                    type: "Integer",
                    validators: [],
                    label: "Maximum gap size to fill between transfrags",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77c36828-6e66-11e5-8579-67629479c0c8",
                    isVisible: true,
                    defaultValue: "50",
                    required: true,
                },
            ],
            step_number: 0,
        },
        {
            id: "77c42448-6e66-11e5-bb61-3304adf49d6a",
            name: "",
            label: "Cuffdiff analysis options",
            parameters: [
                {
                    description: "",
                    arguments: [],
                    name: "-D, ",
                    type: "Flag",
                    validators: [],
                    label: "Fragment bias correction using reference sequence",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77c97394-6e66-11e5-8dcd-bbd7db139032",
                    isVisible: true,
                    defaultValue: "true",
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-E",
                    type: "FileInput",
                    validators: [],
                    label:
                        "Masking file containing transcripts to ignore (.GTF)",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77ca75aa-6e66-11e5-a67e-0766d453e512",
                    isVisible: true,
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-F, ",
                    type: "Flag",
                    validators: [],
                    label: "Use multi read hit rescue method",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77cc85ac-6e66-11e5-a9ac-033a09d59dc6",
                    isVisible: true,
                    defaultValue: "false",
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-G",
                    type: "Integer",
                    validators: [],
                    label:
                        "Minimum number of alignments in a locus for testing",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77cd8be6-6e66-11e5-a3b9-1ff6389fa59c",
                    isVisible: true,
                    defaultValue: "10",
                    required: false,
                },
                {
                    description: "",
                    arguments: [],
                    name: "-H",
                    type: "Double",
                    validators: [],
                    label: "False discovery rate used in testing",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77ce955e-6e66-11e5-b771-0716b8ce1ed0",
                    isVisible: true,
                    defaultValue: "0.0500000000000000028",
                    required: false,
                },
                {
                    description: "",
                    arguments: [
                        {
                            name: "",
                            isDefault: true,
                            id: "77cfed32-6e66-11e5-a7be-ff65b605993d",
                            display:
                                "Count hits compatible with reference RNAs only for normalization",
                            value: "",
                        },
                        {
                            name: "-I",
                            isDefault: false,
                            id: "77d0437c-6e66-11e5-8cb3-372efbad8021",
                            display: "Count all hits for normalization",
                            value: "",
                        },
                    ],
                    name: "",
                    type: "TextSelection",
                    validators: [],
                    label: "Select hits to use for normalization",
                    id:
                        "76009b5a-6e66-11e5-be5d-3b326b43e3dd_77cf8d6a-6e66-11e5-bb58-0b51f85fb2e9",
                    isVisible: true,
                    defaultValue: {
                        id: "77cfed32-6e66-11e5-a7be-ff65b605993d",
                        name: "",
                        value: "",
                        display:
                            "Count hits compatible with reference RNAs only for normalization",
                        isDefault: true,
                    },
                    required: false,
                },
            ],
            step_number: 0,
        },
    ],
};