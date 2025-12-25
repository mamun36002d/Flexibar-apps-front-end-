export const countdownTemplates = [
  {
    value: "none",
    label: "Simple Text",
    html: `
        <span style="margin-left: 10px; font-family: '{{fontFamily}}'; font-size: {{fontSize}}px; font-weight: {{fontWeight}}; color: {{color}};">
            <span class="flexibar-timer-block">{{days}}d</span> :
            <span class="flexibar-timer-block">{{hours}}h</span> :
            <span class="flexibar-timer-block">{{minutes}}m</span> :
            <span class="flexibar-timer-block">{{seconds}}s</span>
        </span>`,
  },
  {
    value: "template1",
    label: "Boxes (Style 1)",
    html: `
        <span style="display: inline-flex; gap: 4px; align-items: center; font-family: '{{fontFamily}}';">
            <span style="background: {{background}}; color: {{color}}; padding: 4px 6px; border-radius: 4px; box-shadow: 2px 2px 4px {{shadow}}; font-size: {{fontSize}}px; font-weight: {{fontWeight}};">{{days}}d</span>
            <span style="color: {{background}}; font-weight: bold;">:</span>
            <span style="background: {{background}}; color: {{color}}; padding: 4px 6px; border-radius: 4px; box-shadow: 2px 2px 4px {{shadow}}; font-size: {{fontSize}}px; font-weight: {{fontWeight}};">{{hours}}h</span>
            <span style="color: {{background}}; font-weight: bold;">:</span>
            <span style="background: {{background}}; color: {{color}}; padding: 4px 6px; border-radius: 4px; box-shadow: 2px 2px 4px {{shadow}}; font-size: {{fontSize}}px; font-weight: {{fontWeight}};">{{minutes}}m</span>
            <span style="color: {{background}}; font-weight: bold;">:</span>
            <span style="background: {{background}}; color: {{color}}; padding: 4px 6px; border-radius: 4px; box-shadow: 2px 2px 4px {{shadow}}; font-size: {{fontSize}}px; font-weight: {{fontWeight}};">{{seconds}}s</span>
        </span>`,
  },
  {
    value: "template2",
    label: "Vertical Stack (Style 2)",
    html: `
        <span style="display: inline-flex; gap: 6px; align-items: center; font-family: '{{fontFamily}}';">
            <span style="text-align: center; background: {{background}}; color: {{color}}; padding: 3px 6px; border-radius: 4px; box-shadow: 1px 1px 3px {{shadow}}; min-width: 35px;">
                <span style="display: block; font-size: {{fontSize}}px; font-weight: {{fontWeight}}; line-height: 1;">{{days}}</span>
                <span style="display: block; font-size: 8px; opacity: 0.8;">DAYS</span>
            </span>
            <span style="color: {{background}}; font-weight: bold; margin-top: -8px;">:</span>
            <span style="text-align: center; background: {{background}}; color: {{color}}; padding: 3px 6px; border-radius: 4px; box-shadow: 1px 1px 3px {{shadow}}; min-width: 35px;">
                <span style="display: block; font-size: {{fontSize}}px; font-weight: {{fontWeight}}; line-height: 1;">{{hours}}</span>
                <span style="display: block; font-size: 8px; opacity: 0.8;">HRS</span>
            </span>
            <span style="color: {{background}}; font-weight: bold; margin-top: -8px;">:</span>
            <span style="text-align: center; background: {{background}}; color: {{color}}; padding: 3px 6px; border-radius: 4px; box-shadow: 1px 1px 3px {{shadow}}; min-width: 35px;">
                <span style="display: block; font-size: {{fontSize}}px; font-weight: {{fontWeight}}; line-height: 1;">{{minutes}}</span>
                <span style="display: block; font-size: 8px; opacity: 0.8;">MINS</span>
            </span>
            <span style="color: {{background}}; font-weight: bold; margin-top: -8px;">:</span>
            <span style="text-align: center; background: {{background}}; color: {{color}}; padding: 3px 6px; border-radius: 4px; box-shadow: 1px 1px 3px {{shadow}}; min-width: 35px;">
                <span style="display: block; font-size: {{fontSize}}px; font-weight: {{fontWeight}}; line-height: 1;">{{seconds}}</span>
                <span style="display: block; font-size: 8px; opacity: 0.8;">SECS</span>
            </span>
        </span>`,
  },
  {
    value: "template3",
    label: "Separated (Style 3)",
    html: `
        <span style="display: inline-flex; gap: 8px; align-items: center; font-family: '{{fontFamily}}';">
             <span style="text-align: center; background: {{background}}; color: {{color}}; padding: 4px 8px; border-radius: 3px; box-shadow: 2px 2px 4px {{shadow}}; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 38px; min-width: 38px;">
                <span style="font-size: {{fontSize}}px; font-weight: {{fontWeight}}; line-height: 1;">{{days}}</span>
                <span style="font-size: 7px; margin-top: 2px;">DAYS</span>
            </span>
            <span style="text-align: center; background: {{background}}; color: {{color}}; padding: 4px 8px; border-radius: 3px; box-shadow: 2px 2px 4px {{shadow}}; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 38px; min-width: 38px;">
                <span style="font-size: {{fontSize}}px; font-weight: {{fontWeight}}; line-height: 1;">{{hours}}</span>
                <span style="font-size: 7px; margin-top: 2px;">HRS</span>
            </span>
            <span style="text-align: center; background: {{background}}; color: {{color}}; padding: 4px 8px; border-radius: 3px; box-shadow: 2px 2px 4px {{shadow}}; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 38px; min-width: 38px;">
                <span style="font-size: {{fontSize}}px; font-weight: {{fontWeight}}; line-height: 1;">{{minutes}}</span>
                <span style="font-size: 7px; margin-top: 2px;">MINS</span>
            </span>
            <span style="text-align: center; background: {{background}}; color: {{color}}; padding: 4px 8px; border-radius: 3px; box-shadow: 2px 2px 4px {{shadow}}; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 38px; min-width: 38px;">
                <span style="font-size: {{fontSize}}px; font-weight: {{fontWeight}}; line-height: 1;">{{seconds}}</span>
                <span style="font-size: 7px; margin-top: 2px;">SECS</span>
            </span>
        </span>
    `
  },
  {
    value: "template4",
    label: "Bordered (Style 4)",
     html: `
        <span style="display: inline-flex; align-items: center; gap: 4px; color: {{color}}; font-family: '{{fontFamily}}'; font-size: {{fontSize}}px; font-weight: {{fontWeight}};">
          <span style="border: 2px solid {{shadow}}; background: {{background}}; border-radius: 5px; padding: 4px 6px;">{{days}}</span> : 
          <span style="border: 2px solid {{shadow}}; background: {{background}}; border-radius: 5px; padding: 4px 6px;">{{hours}}</span> : 
          <span style="border: 2px solid {{shadow}}; background: {{background}}; border-radius: 5px; padding: 4px 6px;">{{minutes}}</span> : 
          <span style="border: 2px solid {{shadow}}; background: {{background}}; border-radius: 5px; padding: 4px 6px;">{{seconds}}</span>
        </span>
        `,
  }
];