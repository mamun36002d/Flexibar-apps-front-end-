// File: app/data/barTemplates.js

export const PREDEFINED_TEMPLATES = [
  {
    label: 'Custom / None',
    value: 'none',
    data: null
  },
  {
    label: 'Flash Sale (Teal)',
    value: 'template_flash',
    data: {
      textSettings: {
        style: { color: "#ffffff", fontSize: 15, fontFamily: "Josefin Sans", fontWeight: 200 },
        message: "FLASH SELL STARTING IN "
      },
      buttonSettings: { isSelected: false, content: "Click Here" },
      barDesignSettings: {
        style: { background: "#4fa6a3", gradientColor1: "", gradientColor2: "", gradientAngle: 0 },
        position: "top",
        animation: "none",
        backgroundType: "solid"
      },
      countdownSettings: { isSelected: true }
    }
  },
  {
    label: 'Christmas Special (Gradient)',
    value: 'template_xmas',
    data: {
      textSettings: {
        style: { color: "#ffffff", fontSize: 24, fontFamily: "Madimi One", fontWeight: 300 },
        message: "🎄 Christmas Special: 25% Off Everything! 🎁"
      },
      buttonSettings: { isSelected: false, content: "Click Here" },
      barDesignSettings: {
        style: {
          background: "linear-gradient(77deg, #e1195e, #e45c29)",
          gradientColor1: "#e1195e",
          gradientColor2: "#e45c29",
          gradientAngle: 77
        },
        position: "top",
        animation: "slideDown", 
        backgroundType: "gradient"
      },
      countdownSettings: { isSelected: false }
    }
  },
  // --- NEW TEMPLATE ADDED HERE ---
  {
    label: 'Black Friday Deal',
    value: 'template_black_friday',
    data: {
      textSettings: {
        style: { color: "#ffffff", fontSize: 19, fontFamily: "Montserrat", fontWeight: 700 },
        message: "BLACK FRIDAY deals starts in 👉"
      },
      buttonSettings: {
        href: "",
        style: { color: "#4d2c2c", animation: "none", borderRadius: 4, backgroundColor: "#dfcd27" },
        content: "See Deal",
        isSelected: true
      },
      barDesignSettings: {
        style: {
          width: 100,
          cursor: null,
          height: 50,
          padding: 8,
          textAlign: "center",
          background: "#c93732",
          marginLeft: 0,
          borderColor: "#717171",
          borderStyle: "hidden",
          borderWidth: 0,
          borderRadius: 0,
          gradientAngle: 0,
          backgroundSize: null,
          gradientColor1: "",
          gradientColor2: "",
          justifyContent: null,
          backgroundImage: null
        },
        position: "top",
        animation: "none",
        clickable: true,
        redirectUrl: null,
        backgroundType: "solid"
      },
      countdownSettings: {
        style: { color: "#fffffe", shadow: "#ca3535", fontSize: 20, background: null, fontFamily: "Montserrat" },
        template: {
          html: "\n        <span style=\"\n        text-align: center;\n        background: {{background}};\n        color: {{color}};\n        margin-left: 3px;\n        padding: 5px;\n        border-radius: 3px;\n        box-shadow: {{shadow}} 2px 4px 5px;\n        font-family: '{{fontFamily}}';\n        font-size: {{fontSize}}px;\">\n        <span id='{{name}}-days'>\n        {{days}}\n        </span>\n        <span style=\"font-size: x-small; margin-top: -7px;\">DAYS</span>\n        </span>\n        <span style=\"color: {{background}}; \n        font-family: '{{fontFamily}}';\n        font-size: {{fontSize}}px;\">&nbsp;</span>\n        <span style=\"\n        text-align: center;\n        background: {{background}};\n        color: {{color}};\n        margin-left: 3px;\n        padding: 5px;\n        border-radius: 3px;\n        box-shadow: {{shadow}} 2px 4px 5px;\n        font-family: '{{fontFamily}}';\n        font-size: {{fontSize}}px;\">\n        <span id='{{name}}-hours'>\n        {{hours}}\n        </span>\n        <span style=\"font-size: x-small; margin-top: -7px;\">HRS</span>\n        </span>\n        <span style=\"color: {{background}}; \n        font-family: '{{fontFamily}}';\n        font-size: {{fontSize}}px;\">&nbsp;</span>\n        <span style=\"\n        text-align: center;\n        background: {{background}};\n        color: {{color}};\n        margin-left: 3px;\n        padding: 5px;\n        border-radius: 3px;\n        box-shadow: {{shadow}} 2px 4px 5px;\n        font-family: '{{fontFamily}}';\n        font-size: {{fontSize}}px;\">\n        <span id='{{name}}-mnt'>\n        {{minutes}}\n        </span>\n        <span style=\"font-size: x-small; margin-top: -7px;\">MINS</span>\n        </span>\n        <span \n        style=\"color: {{background}}; \n        font-family: '{{fontFamily}}';\n        font-size: {{fontSize}}px;\" className=\"value\">&nbsp;</span>\n        <span style=\"\n        text-align: center;\n        background: {{background}};\n        color: {{color}};\n        margin-left: 3px;\n        padding: 5px;\n        border-radius: 3px;\n        box-shadow: {{shadow}} 2px 4px 5px;\n        font-family: '{{fontFamily}}';\n        font-size: {{fontSize}}px;\">\n        <span id='{{name}}-sec' >\n        {{seconds}}\n        </span>\n        <span style=\"font-size: x-small; margin-top: -7px;\">SECS</span>\n        </span>\n        ",
          name: "Style3",
          showValueOnly: false
        },
        isSelected: true,
        targetDate: { date: "2025-06-26", time: "23:59", zone: "Asia/Dhaka" }
      }
    }
  }
];