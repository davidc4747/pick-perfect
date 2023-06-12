beforeEach(function () {
    cy.visit("/");
});

it.skip("Should Display Default selection on load", function () {
    // TODO: I actually have no way of checking since I changed the navbar
    //      I need to do another re-write of the navbar [DC]
    cy.getByTestId("position-default").find(">input").should("be.checked");
});

it("Should display slections based on Role", function () {
    // Add to junlge
    cy.getByTestId("position-top").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-1").click();

    // Add Muliple to middle
    cy.getByTestId("position-middle").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-22").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-48").click();

    cy.getByTestId("position-middle").click();
    cy.getByTestId("selections-pick").children().should("have.lengthOf", 3);
    cy.getByTestId("position-top").click();
    cy.getByTestId("selections-pick").children().should("have.lengthOf", 2);
});

/* ======================== *\
    #Adding Champion
\* ======================== */

it("Should Add a new Champion to Selections", () => {
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-1").click();
    cy.getByTestId("champion-1").should("exist");
});

it("Should NOT display repeat champions", function () {
    // Add Multiple of the Same Champion
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-1").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-1").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-1").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-1").click();

    cy.getByTestId("champion-1").should("exist");
    cy.getByTestId("selections-pick").children().should("have.lengthOf", 2);
});

it("Should display champions under the correct role", () => {
    // Append to jungle selections
    cy.getByTestId("position-jungle").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-1").click();

    // Check that it's actually there
    cy.getByTestId("position-jungle").click();
    cy.getByTestId("champion-1").should("exist");

    // Check that it's not in the other Selections
    cy.getByTestId("position-top").click();
    cy.getByTestId("champion-1").should("not.exist");
});

it("Should return back to Orginal Page after selecting a Champion", function () {
    cy.getByTestId("position-middle").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-1").click();

    cy.contains("Add Champion").should("exist");

    // expect selectedPosition to be 'middle'
    // TODO: Again, I don't actually have a way of checking this
    //      until i update the navbar [DC]
    // cy.getByTestId("position-middle").find(">input").should("be.checked");
});

/* ======================== *\
    #Remove Champion
\* ======================== */

it("Should allow the user to remove an champion from the list", function () {
    cy.getByTestId("position-middle").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-9").click();
    cy.getByTestId("champion-9").rightclick();
    cy.getByTestId("champion-9").should("not.exist");
});

it("Should only remove one champion at a time", function () {
    cy.getByTestId("position-middle").click();

    // add a Bunch to the list
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-22").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-48").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-99").click();

    cy.getByTestId("champion-22").rightclick();

    // NOTE: the length is 3 here cuz there's also the "Add" button in this list [DC]
    cy.getByTestId("selections-pick").children().should("have.lengthOf", 3);
});

it.skip("Should allow user to reorder champions in the list", function () {
    cy.getByTestId("position-middle").click();

    // add a Bunch to the list
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-22").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-48").click();
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-99").click();

    // Mess with the order
    cy.getByTestId("move-champion-48").click();
    cy.getByTestId("move-champion-48").click();

    // check
    cy.getByTestId("selections-pick")
        .find("> li:nth-child(1)")
        .should("have.attr", "data-testid", "champion-99");
});

/* ======================== *\
    #Select Champion
\* ======================== */

it("Should allow use to go back without selecting a champion", function () {
    cy.contains("Add Champion").click();
    cy.getByTestId("btn-cancel").click();
    cy.getByTestId("selections-pick").children().should("have.lengthOf", 1);
});

it("Should display default selection in each role", function () {
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-9").click();
    cy.getByTestId("position-middle").click();
    cy.getByTestId("champion-defaults").should("exist");
});

it("Should allow the user to go to default selection through one of those items", function () {
    cy.contains("Add Champion").click();
    cy.getByTestId("add-champion-9").click();
    cy.getByTestId("position-middle").click();
    cy.getByTestId("champion-defaults").click();

    // TODO: need to update navbar to do this check prperly [DC]
    cy.contains("Add Champion").should("exist");
    // cy.getByTestId("position-default").find(">input").should("be.checked");
});

it("Should allow users to go to the Settings Page", function () {
    cy.getByTestId("btn-settings").click();
    cy.contains("Settings").should("exist");
});
