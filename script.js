/* ==========================================================================
   AI GUAN — PORTFOLIO SCRIPT
   Single source of truth for all copy in zh / en / de, plus the render
   layer that draws each section from that data. Language switching never
   reloads the page and never duplicates markup — it just re-renders.

   Sections:
   1. Content dictionary (all translated copy + structured data)
   2. Icon library (small inline SVGs reused across cards)
   3. Render functions (DOM builders per section)
   4. Language engine (apply / persist / switch)
   5. Theme engine (dark mode / persist)
   6. Accordion behavior
   7. Navigation: scroll spy, smooth scroll, mobile drawer
   8. Scroll reveal (IntersectionObserver)
   9. Init
   ========================================================================== */

/* ---------- 1. Content dictionary ---------- */
const CONTENT = {
  en: {
    nav: { about:"About", experience:"Experience", projects:"Projects", education:"Education", engagement:"Engagement", certificates:"Certificates", skills:"Skills", contact:"Contact" },
    hero: {
      eyebrowHTML: "<span>Data Analytics</span><span>Business Operations</span>",
      headlineHTML: 'Ai Guan —<br><span class="accent-line">Decisions are<br>determined by data.</span>',
      lede: "Business Informatics student at WU Vienna, specializing in Data Science. Certified in Power BI and Excel, with hands-on experience spanning insurance, staffing, and financial services across three languages.",
      cvBtn: "Download CV",
      contactBtn: "Contact me",
      availability: "Open to internships, part-time & remote full-time roles — full-time availability from March 2027",
      location: "Vienna, Austria"
    },
    about: {
      kicker: "01 — Input",
      title: "About",
      p1: "I'm Ai Guan, a Bachelor's student in Business, Economics and Social Sciences at WU Vienna, focused on Business Informatics with a specialization in Data Science. My work spans insurance, staffing, and financial services, always with an eye for turning messy data into decisions people can act on.",
      p2: "Having grown up between Beijing and Vienna — plus a recent one-month internship in Bangkok and travel to more than 30 countries along the way — I move naturally between Mandarin, German, and English in professional settings. I hold rigor with numbers and genuine communication in equal regard — a principle that runs through every internship and volunteer role I've taken on.",
      stats: [ {value:"3", label:"Working languages"}, {value:"3", label:"Industries"}, {value:"2", label:"BI certifications"}, {value:"30+", label:"Countries visited", href:"travels.html"} ]
    },
    experience: {
      kicker: "02 — Process",
      title: "Experience",
      items: [
        { date:"09/2026 – 09/2026", role:"Internship", org:"Asset Management", loc:"Bangkok, Thailand", bullets:[], tag:"Working language: English" },
        { date:"06/2026 – 08/2026", role:"Business Operations &amp; Support Intern (Individual Insurance)", org:"Beijing Life Insurance Co., Ltd. · Headquarters", loc:"Beijing, China",
          bullets:[
            "Conducted market, competitor, and internal company analyses using Power BI; built data-driven dashboards and management reports",
            "Modeled commission and compensation structures in Excel, deepening analytical and quantitative skills",
            "Gained working knowledge of insurance products, industry practices, and internal management processes for external distribution partners",
            "Supported analysis of operational KPIs and identified optimization potential in internal business processes"
          ], tag:"Working language: Mandarin" },
        { date:"02/2025 – 10/2025", role:"Front/Back Office Associate", org:"ProStaff GmbH", loc:"Vienna, Austria",
          bullets:[
            "Coordinated staff scheduling and deployment; processed customer orders and repeat orders",
            "Prepared and reviewed employment contracts; provided administrative support to the back office",
            "Maintained employee and deployment records in the internal database; handled initial phone inquiries"
          ], tag:"Working language: German" },
        { date:"07/2020 – 08/2022", role:"Independent Mandarin Tutor", org:"Self-employed", loc:"Vienna, Austria",
          bullets:[ "Taught foundational Mandarin (A1–A2) to three students, focusing on pronunciation, core vocabulary, and basic sentence structure" ], tag:"" }
      ]
    },
    projects: {
      kicker: "03 — Output",
      title: "Projects",
      items: [
        { status:"Case Study", title:"Insurance KPI Dashboard", subtitle:"Power BI Dashboard", desc:"An interactive Power BI dashboard built on internship data, tracking premium volume, retention, and regional performance for management reporting.", tech:["Power BI","Power Query"] },
        { status:"Case Study", title:"Commission &amp; Salary Structure Model", subtitle:"Excel Financial Model", desc:"An Excel model comparing commission and compensation structures across distribution channels, used to support internal pricing discussions.", tech:["Excel","Financial Modeling"] },
        { status:"Coming Soon", title:"Portfolio Tracker", subtitle:"Personal Finance Tool", desc:"A personal-finance tracker for monitoring investment performance and asset allocation over time.", tech:["Python","SQL"] },
        { status:"Coming Soon", title:"Bachelor's Thesis", subtitle:"WU Vienna · Business Informatics", desc:"An empirical study on the impact of generative AI on private investors' decision-making — examining how AI-generated insights shape retail investment behavior.", tech:["Behavioral Finance","Generative AI","Research"] },
        { status:"Completed", title:"Matura Thesis (VWA)", subtitle:"De La Salle Schule", desc:"\"Die Grenzteilungen ausgewählter Bundesstaaten in den Vereinigten Staaten und deren Bedeutung für die Wirtschaft\" — on the border divisions of selected U.S. states and their economic significance.", tech:["Economics","Research"] }
      ]
    },
    education: {
      kicker: "04 — Training",
      title: "Education",
      items: [
        { date:"09/2022 – present", school:"WU Vienna (Wirtschaftsuniversität Wien)", org:"Bachelor of Arts in Business, Economics and Social Sciences · Track: Business Informatics · Specialization: Data Science", note:"Coursework spans the shared foundations, the cross-degree Common Body of Knowledge, and the Business Informatics track, grouped by stage below.",
          courseGroups: [
            { label:"Foundations (STEOP)", items:["Introduction to Business Administration","Principles of Economics","Business in its Legal Context: European &amp; Public Economic Law I","Mathematics"] },
            { label:"Common Body of Knowledge", items:["Accounting &amp; Management Control I &amp; II","Business Information Systems I","Applied Microeconomics","International Macroeconomics","Business Private Law I","Statistics","Introduction to Business Communication","Sustainable Business I"] },
            { label:"Business Informatics Track", items:["Business Information Systems II","Procurement, Logistics &amp; Production","Algorithmic Thinking &amp; Programming","Information Systems Design","Formal Methods in Business Informatics","Data Communication &amp; Computer Networks","Data and Network Security","Data and Knowledge Engineering","Information Systems Project Governance &amp; Management","Business Process Management","Economic &amp; Financial Policy","Methods of Empirical Social Research"] },
            { label:"Electives", items:["Finance","Marketing","Human Resources, Leadership &amp; Organisation","Intercultural Competence","Foundations of Scientific Work"] }
          ] },
        { date:"09/2016 – 06/2022", school:"De La Salle Schule · Strebersdorf", org:"Vienna, Austria · Matura (Austrian A-levels) · Advanced coursework in Computer Science and Mathematics", note:"" },
        { date:"09/2009 – 06/2016", school:"Beijing Yuecai School", org:"Beijing, China · Elementary &amp; Middle School", note:"Ranked in the top 5% of all students in Beijing for three consecutive years; awarded distinctions for outstanding achievement in music and literature" }
      ]
    },
    certificates: {
      kicker: "05 — Validation",
      title: "Certificates",
      items: [
        { title:"Microsoft Excel", issuer:"TestDome · Public certification test · Apr 2026", badge:"Top 10%", linkText:"Verify certificate →", linkHref:"https://www.testdome.com/certificates/7594f31557d44da59fead2ef1d11df88" },
        { title:"Power BI", issuer:"TestDome · Public certification test · Jul 2026", badge:"Top 10%", linkText:"Verify certificate →", linkHref:"https://www.testdome.com/certificates/7a43f274101e44db801f1a567202cea7" },
        { title:"Tandem Language Program", issuer:"WU Vienna Language Center · Chinese (Mandarin)–German · 2025", badge:"Certificate", linkText:"", linkHref:"" }
      ]
    },
    engagement: {
      kicker: "06 — Feedback Loop",
      title: "Engagement & Activities",
      items: [
        { date:"09/2024 – 03/2025", role:"Language Partner", org:"Tandem Language Program · WU Vienna Language Center", loc:"Vienna, Austria",
          bullets:[
            "Supported an international student in building foundational Chinese skills through structured tandem learning sessions",
            "Documented progress systematically through weekly logging and regular learning updates"
          ], tag:"" },
        { date:"06/2023", role:"Volunteer — Social Care Initiative", org:"ICF Vienna", loc:"Vienna, Austria",
          bullets:[ "Distributed food and hygiene packages to people experiencing homelessness as part of a church-run aid initiative" ], tag:"" }
      ]
    },
    skills: {
      kicker: "07 — Stack",
      title: "Skills",
      languagesLabel: "Languages",
      langs: [ {name:"Mandarin", tag:"Native"}, {name:"German", tag:"C1"}, {name:"English", tag:"C1"}, {name:"Spanish", tag:"B1"} ],
      groups: [
        { label:"Analytics", pills:["Power BI","Excel","Power Query"] },
        { label:"Programming &amp; Tools", pills:["Python","SQL","MySQL","HTML","CSS","PHP","Scratch","MS Office"] },
        { label:"Business", pills:["Business Analysis","Business Process Management","Project Planning &amp; Organization","Data Analysis &amp; Preparation"] },
        { label:"Interests", pills:["Social Engagement","Cultural Exchange","Personal Development","Fitness"] }
      ]
    },
    contact: {
      headlineHTML: "Let's talk <em>data</em>, or life.",
      email: "guanai0912@gmail.com",
      phone: "+43 665 6517 9669",
      location: "Vienna, Austria",
      linkedin: "linkedin.com/in/ai-guan-"
    },
    footer: { cv:"Download full CV (PDF)", copyright:"© 2026 Ai Guan. All rights reserved." }
  },

  zh: {
    nav: { about:"关于", experience:"经历", projects:"项目", education:"教育", engagement:"志愿与活动", certificates:"证书", skills:"技能", contact:"联系" },
    hero: {
      eyebrowHTML: "<span>数据分析</span><span>商业运营</span>",
      headlineHTML: '关艾 —<br><span class="accent-line">决策，由数据决定。</span>',
      lede: "维也纳经济大学商业信息学在读，主修数据科学方向。具备 Power BI 与 Excel 认证能力，横跨保险、人力资源、金融服务等行业的实战经验，中、德、英三语工作能力。",
      cvBtn: "下载简历",
      contactBtn: "联系我",
      availability: "可提供实习、兼职及线上全职工作 · 2027年3月起可全职到岗",
      location: "维也纳，奥地利"
    },
    about: {
      kicker: "01 — 输入",
      title: "关于我",
      p1: "我是关艾，维也纳经济大学（WU Wien）商业与社会科学学士在读，专攻商业信息学，数据科学方向。我的工作横跨保险、人力资源与金融服务行业，擅长把庞杂的数据转化为可执行的商业洞察。",
      p2: "我在北京和维也纳两地成长，此外还曾赴曼谷实习一个月，足迹遍布30多个国家。跨文化的成长背景让我习惯在中文、德语、英语环境中无缝切换协作。我相信严谨的分析能力与真诚的沟通同样重要，这也是我在每一段实习与志愿经历中始终坚持的原则。",
      stats: [ {value:"3", label:"工作语言"}, {value:"3", label:"涉猎行业"}, {value:"2", label:"BI 认证"}, {value:"30+", label:"到访国家", href:"travels.html"} ]
    },
    experience: {
      kicker: "02 — 处理",
      title: "工作经历",
      items: [
        { date:"2026.09 – 2026.09", role:"实习", org:"Asset Management", loc:"泰国 曼谷", bullets:[], tag:"工作语言：英语" },
        { date:"2026.06 – 2026.08", role:"业务运营支持实习生（个人保险）", org:"北京人寿保险股份有限公司 · 总部", loc:"中国 北京",
          bullets:[
            "使用 Power BI 完成市场、竞品及公司层面分析，搭建数据驱动的仪表盘与管理报告",
            "使用 Excel 建立多种佣金与薪酬结构模型，深化分析与量化能力",
            "系统学习各类保险产品及行业知识，掌握面向外部销售伙伴的内部政策与管理流程",
            "协助分析运营关键指标，识别内部业务流程的优化空间"
          ], tag:"工作语言：中文" },
        { date:"2025.02 – 2025.10", role:"前后台业务专员", org:"ProStaff GmbH", loc:"奥地利 维也纳",
          bullets:[
            "负责人员排班协调，处理客户订单与追加订单",
            "制作与审核劳动合同，为后台部门提供行政支持",
            "维护内部数据库中的员工与派工数据，处理客户初次电话咨询"
          ], tag:"工作语言：德语" },
        { date:"2020.07 – 2022.08", role:"独立中文教师", org:"自由职业", loc:"奥地利 维也纳",
          bullets:[ "为三名学生提供中文启蒙教学（A1–A2），聚焦发音、基础词汇与句型结构" ], tag:"" }
      ]
    },
    projects: {
      kicker: "03 — 输出",
      title: "项目",
      items: [
        { status:"案例研究", title:"保险行业 KPI 仪表盘", subtitle:"Power BI 仪表盘", desc:"基于实习期间数据搭建的交互式 Power BI 仪表盘，用于追踪保费规模、客户留存与区域业绩，支持管理层报告。", tech:["Power BI","Power Query"] },
        { status:"案例研究", title:"佣金与薪酬结构模型", subtitle:"Excel 财务模型", desc:"基于 Excel 构建的模型，对比不同销售渠道的佣金与薪酬结构，辅助内部定价讨论。", tech:["Excel","财务建模"] },
        { status:"即将上线", title:"投资组合追踪器", subtitle:"个人理财工具", desc:"用于追踪投资表现与资产配置变化的个人理财工具。", tech:["Python","SQL"] },
        { status:"即将上线", title:"学士论文", subtitle:"维也纳经济大学 · 商业信息学", desc:"实证研究生成式人工智能对个人投资者决策行为的影响，探讨AI生成的信息如何塑造零售投资者的投资行为。", tech:["行为金融学","生成式AI","实证研究"] },
        { status:"已完成", title:"高中毕业论文（VWA）", subtitle:"De La Salle 中学", desc:"《美国部分州边界划分及其经济意义研究》（原题：Die Grenzteilungen ausgewählter Bundesstaaten in den Vereinigten Staaten und deren Bedeutung für die Wirtschaft）", tech:["经济学","实证研究"] }
      ]
    },
    education: {
      kicker: "04 — 训练",
      title: "教育背景",
      items: [
        { date:"2022.09 – 至今", school:"维也纳经济大学（Wirtschaftsuniversität Wien）", org:"商业与社会科学学士 · 专业方向：商业信息学 · 专精：数据科学", note:"课程涵盖入门必修课、跨专业共同核心课程（CBK），以及商业信息学专业课程，按阶段分类如下：",
          courseGroups: [
            { label:"入门必修课（STEOP）", items:["企业管理学导论","国民经济学基础","法律语境下的商业：欧盟与公共经济法 I","数学"] },
            { label:"共同核心课程（CBK）", items:["会计与管理控制 I & II","企业信息系统 I","应用微观经济学","国际宏观经济学","经济私法 I","统计学","商务沟通导论","可持续经营 I"] },
            { label:"商业信息学专业课程", items:["企业信息系统 II","采购、物流与生产","算法思维与编程","信息系统设计","商业信息学形式化方法","数据通信与计算机网络","数据与网络安全","数据与知识工程","信息系统项目治理与管理","业务流程管理","经济与财政政策","实证社会研究方法"] },
            { label:"选修课程", items:["融资","市场营销","人事、领导力与组织","跨文化能力","科研方法基础"] }
          ] },
        { date:"2016.09 – 2022.06", school:"De La Salle 中学 · Strebersdorf", org:"维也纳，奥地利 · 高中毕业会考（Matura）· 计算机科学与数学高阶课程", note:"" },
        { date:"2009.09 – 2016.06", school:"北京市育才学校", org:"北京，中国 · 小学与中学", note:"连续三年位列北京市学生前5%，连续三年被评为「三好学生」，并多次荣获音乐与文学方面的优秀奖" }
      ]
    },
    certificates: {
      kicker: "05 — 验证",
      title: "专业证书",
      items: [
        { title:"Microsoft Excel", issuer:"TestDome · 公开技能认证 · 2026.04", badge:"Top 10%", linkText:"验证证书 →", linkHref:"https://www.testdome.com/certificates/7594f31557d44da59fead2ef1d11df88" },
        { title:"Power BI", issuer:"TestDome · 公开技能认证 · 2026.07", badge:"Top 10%", linkText:"验证证书 →", linkHref:"https://www.testdome.com/certificates/7a43f274101e44db801f1a567202cea7" },
        { title:"Tandem 语言学习项目", issuer:"维也纳经济大学语言中心 · 中文（普通话）– 德语 · 2025", badge:"结业证书", linkText:"", linkHref:"" }
      ]
    },
    engagement: {
      kicker: "06 — 反馈循环",
      title: "志愿与活动",
      items: [
        { date:"2024.09 – 2025.03", role:"语言伙伴", org:"Tandem 语言学习项目 · 维也纳经济大学语言中心", loc:"奥地利 维也纳",
          bullets:[
            "通过结构化的语伴学习环节，协助一名国际学生打好中文基础",
            "通过每周记录与定期学习反馈，系统追踪学习进度"
          ], tag:"" },
        { date:"2023.06", role:"志愿者 — 社会关怀行动", org:"ICF Vienna", loc:"奥地利 维也纳",
          bullets:[ "作为教会救助行动的一部分，向无家可归者发放食物与卫生用品包" ], tag:"" }
      ]
    },
    skills: {
      kicker: "07 — 技术栈",
      title: "技能",
      languagesLabel: "语言",
      langs: [ {name:"中文", tag:"母语"}, {name:"德语", tag:"C1"}, {name:"英语", tag:"C1"}, {name:"西班牙语", tag:"B1"} ],
      groups: [
        { label:"数据分析", pills:["Power BI","Excel","Power Query"] },
        { label:"编程与工具", pills:["Python","SQL","MySQL","HTML","CSS","PHP","Scratch","MS Office"] },
        { label:"商业能力", pills:["商业分析","业务流程管理","项目规划与组织","数据分析与整理"] },
        { label:"兴趣爱好", pills:["社会公益","跨文化交流","个人成长","健身"] }
      ]
    },
    contact: {
      headlineHTML: "期待与你，聊<em>数据</em>，聊人生。",
      email: "guanai0912@gmail.com",
      phone: "+43 665 6517 9669",
      location: "维也纳，奥地利",
      linkedin: "linkedin.com/in/ai-guan-"
    },
    footer: { cv:"下载完整简历（PDF）", copyright:"© 2026 关艾 版权所有" }
  },

  de: {
    nav: { about:"Über mich", experience:"Erfahrung", projects:"Projekte", education:"Ausbildung", engagement:"Engagement", certificates:"Zertifikate", skills:"Fähigkeiten", contact:"Kontakt" },
    hero: {
      eyebrowHTML: "<span>Datenanalyse</span><span>Business Operations</span>",
      headlineHTML: 'Ai Guan —<br><span class="accent-line">Entscheidungen werden<br>von Daten bestimmt.</span>',
      lede: "Studentin der Wirtschaftsinformatik an der WU Wien mit Spezialisierung auf Data Science. Zertifiziert in Power BI und Excel, mit praktischer Erfahrung in Versicherung, Personaldienstleistung und Finanzdienstleistungen — dreisprachig einsatzbereit.",
      cvBtn: "Lebenslauf herunterladen",
      contactBtn: "Kontakt aufnehmen",
      availability: "Verfügbar für Praktika, Teilzeit- & Remote-Vollzeitstellen · Vollzeit ab März 2027",
      location: "Wien, Österreich"
    },
    about: {
      kicker: "01 — Eingabe",
      title: "Über mich",
      p1: "Ich bin Ai Guan, Bachelorstudentin der Wirtschafts- und Sozialwissenschaften an der WU Wien mit Studienzweig Wirtschaftsinformatik und Spezialisierung Data Science. Meine bisherige Erfahrung erstreckt sich über die Versicherungsbranche, Personaldienstleistung und Finanzdienstleistungen.",
      p2: "Aufgewachsen in Peking und Wien — ergänzt durch ein einmonatiges Praktikum in Bangkok und Reisen in mehr als 30 Länder — bewege ich mich selbstverständlich zwischen Chinesisch, Deutsch und Englisch im beruflichen Kontext. Analytische Genauigkeit und echte Kommunikation sind für mich gleichermaßen wichtig — ein Prinzip, das sich durch jedes Praktikum und jedes Ehrenamt zieht.",
      stats: [ {value:"3", label:"Arbeitssprachen"}, {value:"3", label:"Branchen"}, {value:"2", label:"BI-Zertifikate"}, {value:"30+", label:"Bereiste Länder", href:"travels.html"} ]
    },
    experience: {
      kicker: "02 — Verarbeitung",
      title: "Berufserfahrung",
      items: [
        { date:"09/2026 – 09/2026", role:"Praktikum", org:"Asset Management", loc:"Bangkok, Thailand", bullets:[], tag:"Arbeitssprache: Englisch" },
        { date:"06/2026 – 08/2026", role:"Praktikantin – Business Operations/Support (Individualversicherung)", org:"Beijing Life Insurance Co., Ltd. · Hauptverwaltung", loc:"Peking, China",
          bullets:[
            "Durchführung von Markt-, Wettbewerbs- sowie Unternehmensanalysen mit Power BI und Erstellung datenbasierter Dashboards und Managementberichte",
            "Analyse und Modellierung verschiedener Provisions- und Vergütungsstrukturen mit Excel zur Vertiefung analytischer und quantitativer Kompetenzen",
            "Einarbeitung in verschiedene Versicherungsprodukte sowie interne Richtlinien und Managementprozesse für externe Vertriebspartner",
            "Unterstützung bei der Analyse operativer Kennzahlen sowie bei der Identifikation von Optimierungspotenzialen in internen Geschäftsprozessen"
          ], tag:"Arbeitssprache: Chinesisch" },
        { date:"02/2025 – 10/2025", role:"Front/Back Office Mitarbeiterin", org:"ProStaff GmbH", loc:"Wien, Österreich",
          bullets:[
            "Koordination und Einsatzplanung von Personal, Bearbeitung von Kundenbestellungen und Nachbestellungen",
            "Erstellung und Kontrolle von Arbeitsverträgen sowie administrative Unterstützung des Back Office",
            "Pflege und Dokumentation von Mitarbeiter- und Einsatzdaten in der internen Datenbank sowie telefonischer Erstkontakt bei Anfragen"
          ], tag:"Arbeitssprache: Deutsch" },
        { date:"07/2020 – 08/2022", role:"Selbstständige Nachhilfe – Chinesisch", org:"Selbstständig", loc:"Wien, Österreich",
          bullets:[ "Vermittlung grundlegender Mandarin-Kenntnisse (A1–A2) an drei Schüler mit Fokus auf Aussprache, Basisvokabular und einfache Satzstrukturen" ], tag:"" }
      ]
    },
    projects: {
      kicker: "03 — Ausgabe",
      title: "Projekte",
      items: [
        { status:"Fallstudie", title:"KPI-Dashboard Versicherung", subtitle:"Power-BI-Dashboard", desc:"Interaktives Power-BI-Dashboard auf Basis von Praktikumsdaten zur Verfolgung von Prämienvolumen, Kundenbindung und regionaler Performance für das Management-Reporting.", tech:["Power BI","Power Query"] },
        { status:"Fallstudie", title:"Provisions- &amp; Vergütungsmodell", subtitle:"Excel-Finanzmodell", desc:"Excel-Modell zum Vergleich von Provisions- und Vergütungsstrukturen über verschiedene Vertriebskanäle hinweg, genutzt zur Unterstützung interner Preisdiskussionen.", tech:["Excel","Finanzmodellierung"] },
        { status:"Demnächst", title:"Portfolio Tracker", subtitle:"Persönliches Finanztool", desc:"Ein persönliches Finanztool zur Überwachung von Anlageperformance und Vermögensaufteilung im Zeitverlauf.", tech:["Python","SQL"] },
        { status:"Demnächst", title:"Bachelorarbeit", subtitle:"WU Wien · Wirtschaftsinformatik", desc:"Empirische Untersuchung zum Einfluss von generativer KI auf die Entscheidungsfindung privater Anleger — mit Fokus darauf, wie KI-generierte Informationen das Anlageverhalten von Privatanlegern beeinflussen.", tech:["Behavioral Finance","Generative KI","Forschung"] },
        { status:"Abgeschlossen", title:"Vorwissenschaftliche Arbeit (VWA)", subtitle:"De La Salle Schule", desc:"„Die Grenzteilungen ausgewählter Bundesstaaten in den Vereinigten Staaten und deren Bedeutung für die Wirtschaft“", tech:["Volkswirtschaft","Forschung"] }
      ]
    },
    education: {
      kicker: "04 — Training",
      title: "Ausbildung",
      items: [
        { date:"09/2022 – heute", school:"WU Wien (Wirtschaftsuniversität Wien)", org:"Bachelor of Arts in Wirtschafts- und Sozialwissenschaften · Studienzweig Wirtschaftsinformatik · Spezialisierung: Data Science", note:"Die Lehrveranstaltungen gliedern sich in die STEOP, den fächerübergreifenden Common Body of Knowledge (CBK) und den Studienzweig Wirtschaftsinformatik:",
          courseGroups: [
            { label:"Grundlagen (STEOP)", items:["Einführung in die Betriebswirtschaftslehre","Grundlagen der VWL","Wirtschaft im rechtlichen Kontext I","Mathematik"] },
            { label:"Common Body of Knowledge", items:["Accounting &amp; Management Control I &amp; II","Betriebliche Informationssysteme I","Angewandte Mikroökonomik","Internationale Makroökonomik","Wirtschaftsprivatrecht I","Statistik","Introduction to Business Communication","Zukunftsfähiges Wirtschaften I"] },
            { label:"Studienzweig Wirtschaftsinformatik", items:["Betriebliche Informationssysteme II","Beschaffung, Logistik, Produktion","Algorithmisches Denken und Programmierung","Design von Informationssystemen","Formale Methoden der Wirtschaftsinformatik","Datenkommunikation und Rechnernetze","Data and Network Security","Data and Knowledge Engineering","Information Systems Project Governance and Management","Geschäftsprozessmanagement","Wirtschafts- und Finanzpolitik","Methoden der empirischen Sozialforschung"] },
            { label:"Wahlfächer", items:["Finanzierung","Marketing","Personal, Führung, Organisation","Interkulturelle Kompetenz","Grundlagen wissenschaftlichen Arbeitens"] }
          ] },
        { date:"09/2016 – 06/2022", school:"De La Salle Schule – Strebersdorf", org:"Wien, Österreich · Allgemeine Hochschulreife – Matura · Erhöhtes Anforderungsniveau: Informatik und Mathematik", note:"" },
        { date:"09/2009 – 06/2016", school:"Beijing Yuecai School", org:"Peking, China · Grundschule &amp; Mittelschule", note:"Drei Jahre in Folge unter den Top 5% aller Schüler Pekings; mehrfache Auszeichnung für besondere Leistungen im Bereich Musik und Literatur" }
      ]
    },
    certificates: {
      kicker: "05 — Validierung",
      title: "Zertifikate",
      items: [
        { title:"MS Excel", issuer:"TestDome · Öffentlicher Zertifizierungstest · Apr 2026", badge:"Top 10%", linkText:"Verifizieren →", linkHref:"https://www.testdome.com/certificates/7594f31557d44da59fead2ef1d11df88" },
        { title:"Power BI", issuer:"TestDome · Öffentlicher Zertifizierungstest · Jul 2026", badge:"Top 10%", linkText:"Verifizieren →", linkHref:"https://www.testdome.com/certificates/7a43f274101e44db801f1a567202cea7" },
        { title:"Tandem Language Programm", issuer:"Sprachenzentrum der WU Wien · Chinesisch (Mandarin)–Deutsch · 2025", badge:"Zertifikat", linkText:"", linkHref:"" }
      ]
    },
    engagement: {
      kicker: "06 — Feedback-Schleife",
      title: "Engagement & Aktivitäten",
      items: [
        { date:"09/2024 – 03/2025", role:"Sprachpartnerin", org:"Tandem Language Programm · Sprachenzentrum der WU Wien", loc:"Wien, Österreich",
          bullets:[
            "Begleitung eines internationalen Studenten beim Ausbau grundlegender Chinesischkenntnisse durch strukturierte Tandem-Lernsitzungen",
            "Systematische Fortschrittsdokumentation durch wöchentliches Logging sowie regelmäßige Updates zum Lernfortschritt"
          ], tag:"" },
        { date:"06/2023", role:"Freiwilligenarbeit – Social Care Aktionen", org:"ICF Wien", loc:"Wien, Österreich",
          bullets:[ "Ausgabe von Essens- und Hygienepaketen an obdachlose Menschen im Rahmen einer kirchlichen Hilfsinitiative" ], tag:"" }
      ]
    },
    skills: {
      kicker: "07 — Stack",
      title: "Fähigkeiten & Kenntnisse",
      languagesLabel: "Sprachen",
      langs: [ {name:"Chinesisch", tag:"Muttersprache"}, {name:"Deutsch", tag:"C1"}, {name:"Englisch", tag:"C1"}, {name:"Spanisch", tag:"B1"} ],
      groups: [
        { label:"Analytics", pills:["Power BI","Excel","Power Query"] },
        { label:"Programmierung &amp; Tools", pills:["Python","SQL","MySQL","HTML","CSS","PHP","Scratch","MS Office"] },
        { label:"Business", pills:["Business Analysis","Geschäftsprozessmanagement","Projektplanung &amp; Organisation","Datenanalyse &amp; -aufbereitung"] },
        { label:"Interessen", pills:["Soziales Engagement","Kultureller Austausch","Persönlichkeitsentwicklung","Fitness"] }
      ]
    },
    contact: {
      headlineHTML: "Lass uns über <em>Daten</em> sprechen.",
      email: "guanai0912@gmail.com",
      phone: "+43 665 6517 9669",
      location: "Wien, Österreich",
      linkedin: "linkedin.com/in/ai-guan-"
    },
    footer: { cv:"Vollständigen Lebenslauf herunterladen (PDF)", copyright:"© 2026 Ai Guan. Alle Rechte vorbehalten." }
  }
};

/* ---------- 2. Icon library ---------- */
const ICONS = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/><path d="M10 9h4v2.5c.7-1.4 2.2-2.5 4-2.5 3 0 5 2 5 5.5V21h-4v-6c0-1.7-.7-3-2.5-3S13 13.3 13 15v6h-4V9Z"/></svg>'
};

/* ---------- 3. Render functions ---------- */
function renderStatic(lang){
  const c = CONTENT[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const path = el.getAttribute('data-i18n');
    const val = getPath(c, path);
    if(val !== undefined) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const path = el.getAttribute('data-i18n-html');
    const val = getPath(c, path);
    if(val !== undefined) el.innerHTML = val;
  });
}

function getPath(obj, path){
  return path.split('.').reduce((o,k)=> (o == null ? undefined : o[k]), obj);
}

function renderAboutStats(lang){
  const stats = CONTENT[lang].about.stats;
  const el = document.getElementById('aboutStats');
  el.innerHTML = stats.map(s => {
    const tag = s.href ? 'a' : 'div';
    const hrefAttr = s.href ? ` href="${s.href}"` : '';
    const linkClass = s.href ? ' stat-link' : '';
    return `
    <${tag} class="stat${linkClass}"${hrefAttr}>
      <strong>${s.value}</strong>
      <span class="mono">${s.label}</span>
    </${tag}>`;
  }).join('');
}

function renderAccordion(containerId, items, opts){
  const wasOpen = new Set();
  const container = document.getElementById(containerId);
  container.querySelectorAll('.accordion-item.open').forEach((el,i)=> wasOpen.add(i));

  container.innerHTML = items.map((item, i) => {
    const hasDetail = (item.bullets && item.bullets.length) || item.note;
    const openAttr = wasOpen.has(i) ? ' open' : (i === 0 ? ' open' : '');
    const bulletsHTML = item.bullets && item.bullets.length
      ? `<ul>${item.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>` : '';
    const tagHTML = item.tag ? `<div class="xp-tag mono">${item.tag}</div>` : '';
    const noteHTML = item.note ? `<p>${item.note}</p>` : '';
    const courseGroupsHTML = item.courseGroups ? item.courseGroups.map(g => `
      <div class="course-group">
        <h5 class="mono">${g.label}</h5>
        <div class="tech-tags">${g.items.map(c=>`<span>${c}</span>`).join('')}</div>
      </div>`).join('') : '';

    if(opts.type === 'experience'){
      return `
      <div class="accordion-item${openAttr ? ' open' : ''}">
        <button class="accordion-trigger" type="button" aria-expanded="${openAttr ? 'true':'false'}">
          <span class="xp-date mono">${item.date}</span>
          <span class="xp-heading">
            <span class="xp-role">${item.org}</span>
            <span class="xp-org mono">${item.role} <span class="loc">· ${item.loc}</span></span>
          </span>
          <span class="accordion-icon">${ICONS.plus}</span>
        </button>
        <div class="accordion-panel"><div class="accordion-panel-inner">
          <div class="accordion-body">
            <div></div>
            <div>${bulletsHTML}${tagHTML}</div>
          </div>
        </div></div>
      </div>`;
    }
    if(opts.type === 'projects'){
      const techHTML = item.tech && item.tech.length ? `<div class="tech-tags">${item.tech.map(t=>`<span>${t}</span>`).join('')}</div>` : '';
      return `
      <div class="accordion-item${openAttr ? ' open' : ''}">
        <button class="accordion-trigger" type="button" aria-expanded="${openAttr ? 'true':'false'}">
          <span class="xp-date mono">${item.status}</span>
          <span class="xp-heading">
            <span class="xp-role">${item.title}</span>
            <span class="xp-org mono">${item.subtitle}</span>
          </span>
          <span class="accordion-icon">${ICONS.plus}</span>
        </button>
        <div class="accordion-panel"><div class="accordion-panel-inner">
          <div class="accordion-body">
            <div></div>
            <div><p>${item.desc}</p>${techHTML}</div>
          </div>
        </div></div>
      </div>`;
    }
    // education
    return `
    <div class="accordion-item${openAttr ? ' open' : ''}">
      <button class="accordion-trigger" type="button" aria-expanded="${openAttr ? 'true':'false'}">
        <span class="xp-date mono">${item.date}</span>
        <span class="xp-heading">
          <span class="xp-role">${item.school}</span>
          <span class="xp-org mono">${item.org}</span>
        </span>
        <span class="accordion-icon">${ICONS.plus}</span>
      </button>
      <div class="accordion-panel"><div class="accordion-panel-inner">
        <div class="accordion-body edu-body">
          <div></div>
          <div>${noteHTML || '<p class="mono" style="opacity:.55">—</p>'}${courseGroupsHTML}</div>
        </div>
      </div></div>
    </div>`;
  }).join('');

  container.querySelectorAll('.accordion-trigger').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

function renderCertificates(lang){
  const items = CONTENT[lang].certificates.items;
  const grid = document.getElementById('certGrid');
  grid.innerHTML = items.map(c => `
    <article class="cert-card">
      <div class="cert-icon">${ICONS.badge}</div>
      <h3>${c.title}</h3>
      <div class="issuer mono">${c.issuer}</div>
      <div class="cert-meta">
        <span class="cert-badge mono">${c.badge}</span>
        ${c.linkHref ? `<a class="cert-link mono" href="${c.linkHref}" target="_blank" rel="noopener">${c.linkText}</a>` : ''}
      </div>
    </article>`).join('');
}

function renderSkills(lang){
  const s = CONTENT[lang].skills;
  document.getElementById('langGrid').innerHTML = s.langs.map(l => `
    <div class="lang-card">
      <h5>${l.name}</h5>
      <div class="tag mono">${l.tag}</div>
    </div>`).join('');
  document.getElementById('skillGroups').innerHTML = s.groups.map(g => `
    <div class="skill-card">
      <h4>${g.label}</h4>
      <div class="skill-pills">${g.pills.map(p=>`<span class="pill">${p}</span>`).join('')}</div>
    </div>`).join('');
}

function renderContact(lang){
  const c = CONTENT[lang].contact;
  document.getElementById('contactLinks').innerHTML = `
    <a href="mailto:${c.email}">${ICONS.mail} ${c.email}</a>
    <a href="tel:${c.phone.replace(/\s+/g,'')}">${ICONS.phone} ${c.phone}</a>
    <span>${ICONS.pin} ${c.location}</span>
    <a href="https://${c.linkedin}" target="_blank" rel="noopener">${ICONS.linkedin} ${c.linkedin}</a>
  `;
}

function renderAll(lang){
  renderStatic(lang);
  renderAboutStats(lang);
  renderAccordion('experienceList', CONTENT[lang].experience.items, { type:'experience' });
  renderAccordion('educationList', CONTENT[lang].education.items, { type:'education' });
  renderAccordion('engagementList', CONTENT[lang].engagement.items, { type:'experience' });
  renderAccordion('projectsList', CONTENT[lang].projects.items, { type:'projects' });
  renderCertificates(lang);
  renderSkills(lang);
  renderContact(lang);
  refreshReveal();
}

/* ---------- 4. Language engine ---------- */
function setLanguage(lang){
  if(!CONTENT[lang]) lang = 'en';
  localStorage.setItem('ag-lang', lang);
  document.querySelectorAll('.langswitch button').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  const cvPath = `assets/Ai-Guan-CV.pdf`;
  const heroCv = document.getElementById('heroCvBtn');
  const footerCv = document.getElementById('footerCvBtn');
  if(heroCv) heroCv.href = cvPath;
  if(footerCv) footerCv.href = cvPath;
  renderAll(lang);
}

/* ---------- 5. Theme engine ---------- */
function initTheme(){
  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('click', ()=>{
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('ag-theme', isDark ? 'dark' : 'light');
  });
}

/* ---------- 7. Navigation ---------- */
function initNav(){
  const navToggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileDrawer');
  navToggle.addEventListener('click', ()=>{
    const open = drawer.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      drawer.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  const sections = ['about','experience','projects','education','engagement','certificates','skills','contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('[data-nav-link]');

  const spy = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        navLinks.forEach(link=>{
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => spy.observe(s));
}

/* ---------- 8. Scroll reveal ---------- */
let revealObserver;
function refreshReveal(){
  const targets = document.querySelectorAll('.reveal:not(.is-visible)');
  targets.forEach((el, i)=>{
    if(el.classList.contains('reveal-stagger')){
      [...el.children].forEach((child, ci)=> child.style.setProperty('--i', ci));
    }
    revealObserver.observe(el);
  });
}
function initReveal(){
  revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  refreshReveal();
}

/* ---------- 9. Init ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  initTheme();
  initNav();
  initReveal();

  document.querySelectorAll('.langswitch button').forEach(btn=>{
    btn.addEventListener('click', ()=> setLanguage(btn.dataset.lang));
  });

  const savedLang = localStorage.getItem('ag-lang');
  const browserLang = (navigator.language || 'en').slice(0,2);
  const initialLang = CONTENT[savedLang] ? savedLang : (CONTENT[browserLang] ? browserLang : 'en');
  setLanguage(initialLang);
});
