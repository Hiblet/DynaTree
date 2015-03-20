///////////////////////////////////////////////////////////////////////////////
// STYLE DECLARATION
// Use double quotes in JavaScript


// To include files for VS to understand and query them, use this syntax..
///<reference path="../FCUtils.js" />
///<reference path="../DynaTree.js" />

// Define the console if not already defined
if (!window.console) console = { log: function () { } };



///////////////////////////////////////////////////////////////////////////////
// Global Namespace for this application
//
var nz = nz || {};
nz.orders = new Object();
nz.orders.config = new Object();



///////////////////////////////////////////////////////////////////////////////
// Log Wrapper
//

nz.orders.config.bLog = true;

nz.orders.log = function (msg) { if (nz.orders.config.bLog) { console.log(msg); } }
nz.orders.warn = function (msg) { if (nz.orders.config.bLog) { console.warn(msg); } }
nz.orders.error = function (msg) { if (nz.orders.config.bLog) { console.error(msg); } }



nz.orders.init = function () {
    var prefix = "nz.orders.init() - ";
    nz.orders.log(prefix + "Entering");

    nz.orders.tempTestStringStuff();

    // BUILD A STYLE OBJECT TO DEFINE THE TREE STYLE
    var styleDefn = new Object();
    styleDefn["ulClass"] = "ulTestClass";
    styleDefn["liClass"] = "liTestClass";
    styleDefn["btnClass"] = "btnTestClass";
    styleDefn["branchCheckboxClass"] = "cbBranchTestClass";
    styleDefn["leafCheckboxClass"] = "cbLeafTestClass";
    styleDefn["anchorClass"] = "anchorTestClass";

    var jContractTree = null;
    var hfContractTree = $("[id*=hfContractTree]");
    if (fc.utils.isValidVar(hfContractTree)) {
        var sJson = hfContractTree.val();
        try {
            jContractTree = JSON.parse(sJson); // Should hydrate to an array of JavaScript objects
        }
        catch (e) {
            var msgError = "Json Re-hydration Failed. ";
            nz.orders.error(prefix + msgError + e.message);
            return;
        }

        var divContainer = $("[id*=divContainer]");
        var containerID = divContainer[0].id;

        var bShowBranchCheckboxes = true;
        var bShowLeafCheckboxes = true;
        var bMultiSelect = true;
        var bShowValuesAsTooltips = true;

        nz.dynatree.Build(
            jContractTree,              // JS object data
            containerID,                // Element that will have tree appended
            styleDefn,                  // Styles
            "myFirstTree",              // Unique name for this tree
            bMultiSelect,               // Mode; TRUE implies multiple checks are allowed; FALSE implies checking an item unchecks all other items.
            bShowValuesAsTooltips,      // Mode; TRUE implies leaf values display as tooltips; FALSE implies leaf values are appended to leaf keys separated by " : "
            bShowBranchCheckboxes,      // Flag to indicate preference for showing checkboxes on Branches / folders.
            bShowLeafCheckboxes);       // Flag to indicate preference for showing checkboxes on Leaves / files.





        // /////////////////////////////////////
        // Initialize the tree with some data.

        // SingleSelect mode requires an array with one element.
        // MultiSelect mode expects an array of any size.
        var arrInitDataSingleSelectFailA = null; // No data - CORRECT
        var arrInitDataSingleSelectFailB = 5; // Bad Data - CORRECT
        var arrInitDataSingleSelectFailC = []; // Empty array - CORRECT
        var arrInitDataSingleSelectFailD = ["String1", "String2"]; // Array too big - CORRECT
        var arrInitDataSingleSelectFailE = ["DoesNotExist"]; // Right size, data should not be found - CORRECT, SILENT FAIL
        var arrInitDataSingleSelectSuccessA = ["C-JAN2015"]; // With bMatchKey=true; OK, but will be found multiple times, last should win - CORRECT
        var arrInitDataSingleSelectSuccessB = ["~/COMPANYNAME/CONTINUOUS/C-JAN2015"]; // With bMatchPath=true; OK, should get single match on exact item - CORRECT
        var arrInitDataSingleSelectSuccessC = ["~/COMPANYNAME/AUCTION"]; // With bMatchPath=true; OK, should set Branch true, sub-items not true; - CORRECT

        var arrInitDataMultiSelectFailA = null; // No data - CORRECT
        var arrInitDataMultiSelectFailB = "5"; // Bad Data - CORRECT
        var arrInitDataMultiSelectFailC = []; // Empty array
        var arrInitDataMultiSelectSuccessA = ["B-JAN2015"]; // With bMatchKey=true; OK, but found multiple times, expect every B-JAN2015 contract to be selected
        var arrInitDataMultiSelectSuccessB = [
            "~/OTHER/CONTINUOUS/CAT-A/DEC2014",
            "~/OTHER/AUCTION/DEC2014",
            "~/COMPANYNAME/CONTINUOUS/B-JAN2015"
            ]; // With bMatchPath=true; OK, should get single match on all exact items - CORRECT
        var arrInitDataMultiSelectSuccessC = ["~/COMPANYNAME/AUCTION"]; // With bMatchPath=true; OK, should set Branch true, sub-items true also;

        var arrInitData = arrInitDataMultiSelectSuccessC;
        var bMatchKey = false;
        var bMatchPath = true;
        nz.dynatree.Init("myFirstTree", arrInitData, bMatchPath, bMatchKey);



        ////////////////////////////
        // Set a callback function

        nz.dynatree.SetCallback_onCheckedChanged("myFirstTree", nz.orders.getChecked);

        ///////////////////////////////
        // Turn list items into links

        nz.dynatree.LinkifyLeaves("myFirstTree", "http://www.google.com?search=%SUB%", "%SUB%");
    }
    else {
        nz.orders.error(prefix + "Failed to retrieve object using JQuery selector.");
    }

    nz.orders.hookupHandlers(); // Testing buttons

    nz.orders.log(prefix + "Exiting");
}

$(window).load(nz.orders.init);




nz.orders.hookupHandlers = function () {
    $("[id*=btnLeaves]").click(nz.orders.btnLeaves_onClick);
    $("[id*=btnBranches]").click(nz.orders.btnBranches_onClick);
    $("[id*=btnBoth]").click(nz.orders.btnBoth_onClick);
}


nz.orders.btnLeaves_onClick = function () {
    nz.orders.updateFeedback(nz.dynatree.GetSelectedLeaves("myFirstTree", false));
}

nz.orders.btnBranches_onClick = function () {
    nz.orders.updateFeedback(nz.dynatree.GetSelectedBranches("myFirstTree"));
}

nz.orders.btnBoth_onClick = function () {
    nz.orders.updateFeedback(nz.dynatree.GetSelectedLeavesAndBranches("myFirstTree"));
}

nz.orders.updateFeedback = function (arrResult) {
    var separator = "<br />";
    var result = arrResult.join(separator);
    var divFeedback = $("[id*=divFeedback]");
    divFeedback.html(result);
}

// Callback function
nz.orders.getChecked = function (sTreeId) {
    var separator = "<br />";
    var arrResult = [];

    // Get leaves
    arrResult.push("LEAVES:");

    var arrLeaves = nz.dynatree.GetSelectedLeaves(sTreeId);
    arrResult = arrResult.concat(arrLeaves);

    // Get branches
    arrResult.push("BRANCHES:");

    var arrBranches = nz.dynatree.GetSelectedBranches(sTreeId);
    arrResult = arrResult.concat(arrBranches);

    // Output
    var result = arrResult.join(separator);
    var divFeedback = $("[id*=divFeedback]");
    divFeedback.html(result);
}

///////////////////////////////////////////////////////
// Temporary string testing, not part of main project

nz.orders.tempTestStringStuff = function () {
    var s1 = "ABCDEF-123-456";

    var s1Filtered = fc.utils.filter(s1, "BDF123456789-");

    var s1TruncatedShort = fc.utils.truncate(s1, 2); // "AB"
    var s1TruncatedLong = fc.utils.truncate(s1, 10); // "ABCDEF-123"
    var s1TruncatedEllipsisShort = fc.utils.truncate(s1, 2, true);
    var s1TruncatedEllipsisLong = fc.utils.truncate(s1, 10, true); // "ABCDEF-...";

    var sInsert = "(INSERTED)";
    var s1Inserted = fc.utils.insertAtIndex(s1, sInsert, 3); // "ABC(INSERTED)DEF-123-456"

    var s1Prepended = fc.utils.insertAtIndex(s1, "~", 0); // "~ABCDEF-123-456"
    var s1Silly = fc.utils.insertAtIndex(s1, "/", 99); // "ABCDEF-123-456/"
}