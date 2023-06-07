// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { UserSelections } from "../../src/shared/types";

Cypress.on("window:before:load", (win) => {
    let model: UserSelections = {
        all: {
            ban: [],
            hover: [],
            pick: [],
        },

        top: {
            ban: [],
            hover: [],
            pick: [],
        },

        jungle: {
            ban: [],
            hover: [],
            pick: [],
        },

        middle: {
            ban: [],
            hover: [],
            pick: [],
        },

        bottom: {
            ban: [202, 81, 236],
            hover: [],
            pick: [],
        },

        utility: {
            ban: [412, 350, 117],
            hover: [],
            pick: [],
        },
    };
    win.electron = {
        updateSelections: (data: UserSelections): void => {
            model = data;
        },
        getSelections(): Promise<UserSelections> {
            return Promise.resolve(model);
        },
    };
});
