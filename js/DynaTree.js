///////////////////////////////////////////////////////////////////////////////
// STYLE DECLARATION
// Use double quotes in JavaScript


// To include files for VS to understand and query them, use this syntax..
///<reference path="../FCUtils.js" />

// Define the console if not already defined
if (!window.console) console = { log: function () { } };



///////////////////////////////////////////////////////////////////////////////
// Global Namespace for this application
//
var nz = nz || {};
nz.dynatree = new Object();
nz.dynatree.config = new Object();


///////////////////////////////////////////////////////////////////////////////
// Constants

nz.dynatree.config.sDelim = "_";
nz.dynatree.config.sPathDelimiter = "/";
nz.dynatree.config.sKeyValueDelimiter = " : ";

// Button text
nz.dynatree.config.sButtonMinus = "-";
nz.dynatree.config.sButtonPlus = "+";

// DataNode Types
nz.dynatree.config.sDataNodeTypeLeaf = "LEAF"; 
nz.dynatree.config.sDataNodeTypeBranch = "BRANCH";
nz.dynatree.config.sDataNodeTypeRoot = "~"; 


///////////////////////////////////////////////////////////////////////////////
// Log Wrapper
//

nz.dynatree.config.bLog = true;

nz.dynatree.log = function (msg) { if (nz.dynatree.config.bLog) { console.log(msg); } }
nz.dynatree.warn = function (msg) { if (nz.dynatree.config.bLog) { console.warn(msg); } }
nz.dynatree.error = function (msg) { if (nz.dynatree.config.bLog) { console.error(msg); } }





///////////////////////////////////////////////////////////////////////////////
// ENTRY POINT
//

// This function expects an argument that is a javascript object.
// It will attempt to iterate the object and build a tree from it.
// Failure results in returning a null object.
nz.dynatree.Build = function (
    objData, containerID, styleDefn, sTreeId,
    bMultiSelect, bShowValuesAsTooltips, bShowBranchCheckboxes, bShowLeafCheckboxes) {
    var prefix = "nz.dynatree.build() - ";
    nz.dynatree.log(prefix + "Entering");

    // Sanity
    if (fc.utils.isInvalidVar(objData)) {
        nz.dynatree.error(prefix + "Data object argument passed was not a valid variable.");
        return;
    }

    if (fc.utils.isInvalidVar(containerID)) {
        nz.dynatree.error(prefix + "Argument passed for containerID was not a valid variable.");
        return;
    }

    if (fc.utils.isInvalidVar(styleDefn)) {
        nz.dynatree.error(prefix + "StyleDefn argument passed was not a valid variable.");
        return;
    }

    if (fc.utils.isInvalidVar(sTreeId)) {
        nz.dynatree.error(prefix + "sTreeId (tree name) argument passed was not a valid variable.");
        return;
    }


    // Cache the settings for use later.  All data pertaining to this table
    // will then be stored in this area.
    nz.dynatree[sTreeId] = new Object();
    nz.dynatree[sTreeId]["styleDefn"] = styleDefn;
    nz.dynatree[sTreeId]["objData"] = objData;

    var bMultiSelect = (typeof bMultiSelect === "undefined") ? true : bMultiSelect; // Default syntax; Default to true
    nz.dynatree[sTreeId]["bMultiSelect"] = bMultiSelect;

    var bShowValuesAsTooltips = (typeof bShowValuesAsTooltips === "undefined") ? false : bShowValuesAsTooltips; // Default syntax; Default to false
    nz.dynatree[sTreeId]["bShowValuesAsTooltips"] = bShowValuesAsTooltips;

    var bShowBranchCheckboxes = (typeof bShowBranchCheckboxes === "undefined") ? false : bShowBranchCheckboxes; // Default syntax; Default to false
    nz.dynatree[sTreeId]["bShowBranchCheckboxes"] = bShowBranchCheckboxes;

    var bShowLeafCheckboxes = (typeof bShowLeafCheckboxes === "undefined") ? false : bShowLeafCheckboxes; // Default syntax; Default to false
    nz.dynatree[sTreeId]["bShowLeafCheckboxes"] = bShowLeafCheckboxes;

    nz.dynatree.createTree(objData, containerID, styleDefn, sTreeId);

    nz.dynatree.log(prefix + "Exiting;");
}



nz.dynatree.createTree = function (objData, containerID, styleDefn, sTreeId) {
    var prefix = "nz.dynatree.createTree() - ";
    nz.dynatree.log(prefix + "Entering");

    // Create the root list 
    var ul = document.createElement("ul");
    ul.className = styleDefn["ulClass"] || "";
    ul.setAttribute("data-nodeType", nz.dynatree.config.sDataNodeTypeBranch);
    ul.id = sTreeId;
    ul.setAttribute("data-path", nz.dynatree.config.sDataNodeTypeRoot);

    // Add the root list to the document so that the subroutines 
    // can add to it.
    var container = document.getElementById(containerID);
    if (container == null) {
        nz.dynatree.log(prefix + "Could not retrieve container using containerID of >" + containerID + "<");
        return;
    }

    container.appendChild(ul);

    // Build the tree under the root
    nz.dynatree.traverseTree(objData, nz.dynatree.processNode, ul.id, sTreeId);

    nz.dynatree.log(prefix + "Exiting");
}




nz.dynatree.processNode = function (key, value, nodeID, sTreeId, depth) {
    var prefix = "nz.dynatree.processNode() - ";
    nz.dynatree.log(prefix + "Entering; key=" + key + ", value=" + value + ", nodeID=" + nodeID + ", depth=" + depth);

    var styleDefn = nz.dynatree[sTreeId]["styleDefn"];
    var bShowValuesAsTooltips = nz.dynatree[sTreeId]["bShowValuesAsTooltips"];
    var bShowBranchCheckboxes = nz.dynatree[sTreeId]["bShowBranchCheckboxes"];
    var bShowLeafCheckboxes = nz.dynatree[sTreeId]["bShowLeafCheckboxes"];

    var node = document.getElementById(nodeID);
    var parent = node.parentNode;

    // Regardless of type, create a list item and append it

    var li = document.createElement("li");
    li.className = styleDefn["liClass"] || "";

    var parentPath = parent.getAttribute("data-path") || nz.dynatree.config.sDataNodeTypeRoot;
    var path = parentPath + nz.dynatree.config.sPathDelimiter + key;
    li.setAttribute("data-path", path);

    li.id = nz.dynatree.getId("li", sTreeId, path);
    node.appendChild(li);

    if (typeof value == "object") {
        nz.dynatree.log("BRANCH NODE (" + depth + "): " + key);

        // Add an expand/collapse button before the text
        var btnExpand = document.createElement("button");
        var btnText = document.createTextNode(nz.dynatree.config.sButtonMinus);
        btnExpand.setAttribute("type", "button"); // Without this line, default type is 'submit', and form reloads with each click.
        btnExpand.appendChild(btnText);
        btnExpand.setAttribute("data-path", path);
        btnExpand.setAttribute("data-tree", sTreeId);
        btnExpand.id = nz.dynatree.getId("btn", sTreeId, path);
        btnExpand.className = styleDefn["btnClass"];
        btnExpand.onclick = nz.dynatree.btnExpand_onClick;
        li.appendChild(btnExpand);

        // Set the text for the level
        li.appendChild(document.createTextNode(key));

        // Add a checkbox and set the visibility
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = styleDefn["branchCheckboxClass"] || "";
        cb.id = nz.dynatree.getId("cb", sTreeId, path);
        cb.setAttribute("data-path", path);
        cb.setAttribute("data-key", key);
        cb.setAttribute("data-tree", sTreeId);
        cb.setAttribute("data-nodeType", nz.dynatree.config.sDataNodeTypeBranch);
        li.appendChild(cb);
        cb.onclick = nz.dynatree.checkboxBranch_onClick;
        cb.checked = "";
        cb.style.display = bShowBranchCheckboxes ? "" : "none";

        // Create a new list within this list item
        var ul = document.createElement("ul");
        ul.className = styleDefn["ulClass"] || "";
        ul.setAttribute("data-nodeType", nz.dynatree.config.sDataNodeTypeBranch);
        //ul.setAttribute("data-expanded", "TRUE");
        ul.id = nz.dynatree.getId("ul", sTreeId, path);


        // Add the new list after the text
        li.appendChild(ul);


        // Move down the dom by repositioning to the this node
        nz.dynatree.log(prefix + "Exiting; Returning next node as " + ul.id);
        return ul.id;
    }
    else {
        var liText = key;
        if (!fc.utils.isEmptyStringOrWhiteSpace(value)) {
            if (bShowValuesAsTooltips) {
                li.title = value;
            }
            else {
                liText = liText + nz.dynatree.config.sKeyValueDelimiter + value;
            }
        }

        nz.dynatree.log("LEAF NODE (" + depth + "): " + liText);

        // Set the text for the level
        li.appendChild(document.createTextNode(liText));
        li.setAttribute("data-nodeType", nz.dynatree.config.sDataNodeTypeLeaf);


        // Add a checkbox and set the visibility
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = styleDefn["leafCheckboxClass"] || "";
        cb.id = nz.dynatree.getId("cb", sTreeId, path);
        cb.setAttribute("data-path", path);
        cb.setAttribute("data-key", key);
        cb.setAttribute("data-tree", sTreeId);
        cb.setAttribute("data-nodeType", nz.dynatree.config.sDataNodeTypeLeaf);
        li.appendChild(cb);
        cb.onclick = nz.dynatree.checkboxLeaf_onClick;
        cb.checked = "";
        cb.style.display = bShowLeafCheckboxes ? "" : "none";

        // Set the node to be a Leaf - Note that it may already
        // have been set by a sibling but it is quicker just to set
        // it than to check and conditionally reset.
        node.setAttribute("data-nodeType", nz.dynatree.config.sDataNodeTypeLeaf);

        // Stay on this node by returning current node ID
        nz.dynatree.log(prefix + "Exiting; (Remaining) Returning node as " + nodeID);
        return nodeID;
    }
}



nz.dynatree.traverseTree = function (o, fn, nodeID, sTreeId, depth) {
    var prefix = "nz.dynatree.traverseTree() - ";
    var depth = (typeof depth === "undefined") ? 0 : depth; // Default syntax

    nz.dynatree.log(prefix + "Entering; nodeID=" + nodeID + ", depth=" + depth);

    var currentNodeID = nodeID; // Remember the node

    for (var i in o) {
        var nextNodeID = fn.apply(this, [i, o[i], nodeID, sTreeId, depth]);
        if (o[i] !== null && (typeof (o[i]) == "object")) {
            nz.dynatree.traverseTree(o[i], fn, nextNodeID, sTreeId, depth + 1); // Stepping down a level in the tree            
            nodeID = currentNodeID; // Once we have traversed to the bottom of the tree, walk back up
        }
    }    
}

nz.dynatree.getId = function (sType, sTreeId, sTextName) {
    var d = nz.dynatree.config.sDelim;
    return sType + d + sTreeId + d + sTextName;
}




nz.dynatree.toggleBranch = function (sTreeId, path) {
    var prefix = "nz.dynatree.toggleBranch() - ";
    nz.dynatree.log(prefix + "Entering");

    var btnId = nz.dynatree.getId("btn", sTreeId, path);
    var btn = document.getElementById(btnId);
    var btnTextNode = btn.firstChild;
    var btnText = fc.utils.textContent(btnTextNode);

    var ulId = nz.dynatree.getId("ul", sTreeId, path);
    var ul = document.getElementById(ulId);

    if (btnText == nz.dynatree.config.sButtonMinus) {
        // Hide
        fc.utils.textContent(btnTextNode, nz.dynatree.config.sButtonPlus);
        ul.style.display = "none";
    }
    else {
        // Show
        fc.utils.textContent(btnTextNode, nz.dynatree.config.sButtonMinus);
        ul.style.display = "";
    }

    nz.dynatree.log(prefix + "Exiting");
}



///////////////
// CHECKBOXES

// MultiSelect; Set all child checkboxes to checked or unchecked
nz.dynatree.checkboxMultiSelect = function (sTreeId, path, bState) {
    var prefix = "nz.dynatree.checkboxMultiSelect() - ";
    nz.dynatree.log(prefix + "Entering");

    // Get the ul element at this path
    var ulId = nz.dynatree.getId("ul", sTreeId, path);
    var ul = document.getElementById(ulId);

    if (fc.utils.isInvalidVar(ul)) {
        var msgInvalidList = "Could not retrieve ul list element using id >" + ulId + "<";
        nz.dynatree.error(prefix + msgInvalidList);
    }

    // Get all checkboxes under this element
    var inputElements = ul.getElementsByTagName("input");
    var inputElementsLength = inputElements.length;
    var i = 0;
    for (; i < inputElementsLength; ++i) {
        var inputElement = inputElements[i];
        if (inputElement.type == "checkbox") {
            inputElement.checked = bState;
        }
    }

    nz.dynatree.log(prefix + "Exiting");
}



nz.dynatree.checkboxSingleSelect = function (sTreeId, path, bState) {
    var prefix = "nz.dynatree.checkboxSingleSelect() - ";
    nz.dynatree.log(prefix + "Entering");

    // If we are unchecking, no action required
    if (bState == false) {
        var msgUnchecking = "Exiting; Unchecking a checkbox, no action required";
        nz.dynatree.log(prefix + msgUnchecking);
        return;
    }

    // We are checking; 
    // Reset all checkboxes, and set only this checkbox.

    // Get the root of the tree
    var tree = document.getElementById(sTreeId);
    if (fc.utils.isInvalidVar(tree)) {
        nz.dynatree.error(prefix + "Could not retrieve element using id of >" + sTreeId + "<");
        return;
    }

    // Get the checkboxes and iterate over them, unchecking
    var inputElements = tree.getElementsByTagName("input");
    var inputElementsLength = inputElements.length;
    var i = 0;
    for (; i < inputElementsLength; ++i) {
        var inputElement = inputElements[i];
        if (inputElement.type == "checkbox") {
            // If this is not the checkbox that was clicked, uncheck it
            if (path != inputElement.getAttribute("data-path")) {
                inputElement.checked = false;
            }
        }
    }

    nz.dynatree.log(prefix + "Exiting; Checking a checkbox; Peer checkboxes unchecked.");
}





/////////////////
// GET SELECTED

nz.dynatree.GetSelectedLeaves = function (sTreeId, bIncludePath) {
    return nz.dynatree.getSelected(sTreeId, true, false, bIncludePath);
}

nz.dynatree.GetSelectedBranches = function (sTreeId, bIncludePath) {
    return nz.dynatree.getSelected(sTreeId, false, true, bIncludePath);
}

nz.dynatree.GetSelectedLeavesAndBranches = function (sTreeId, bIncludePath) {
    return nz.dynatree.getSelected(sTreeId, true, true, bIncludePath);
}

// Retrieve the leaves or branches, currently selected.
// Returns an array of path values.
nz.dynatree.getSelected = function (sTreeId, bLeaves, bBranches, bIncludePath) {
    var prefix = "nz.dynatree.getSelected() - ";
    nz.dynatree.log(prefix + "Entering");

    var bLeaves = (typeof bLeaves === "undefined") ? true : bLeaves; // Default syntax; Leaves defaults true
    var bBranches = (typeof bBranches === "undefined") ? true : bBranches; // Default syntax; Branches defaults true
    var bIncludePath = (typeof bIncludePath === "undefined") ? true : bIncludePath; // Default syntax; IncludePath defaults true


    // Get the root of the tree
    var tree = document.getElementById(sTreeId);
    if (fc.utils.isInvalidVar(tree)) {
        nz.dynatree.error(prefix + "Could not retrieve element using id of >" + sTreeId + "<");
        return;
    }

    // Create result array to return
    var arrResult = [];

    // Get the checkboxes
    var inputElements = tree.getElementsByTagName("input");
    var inputElementsLength = inputElements.length;
    var i = 0;
    for (; i < inputElementsLength; ++i) {
        var inputElement = inputElements[i];
        if (inputElement.type == "checkbox") {
            var dataType = inputElement.getAttribute("data-nodeType");

            if ((bBranches && dataType == nz.dynatree.config.sDataNodeTypeBranch) ||
                (bLeaves && dataType == nz.dynatree.config.sDataNodeTypeLeaf)) {
                if (inputElement.checked) {
                    if (bIncludePath) {
                        arrResult.push(inputElement.getAttribute("data-path"));
                    }
                    else {
                        arrResult.push(inputElement.getAttribute("data-key"));
                    }
                }
            }
        }
    }

    nz.dynatree.log(prefix + "Exiting; Return " + arrResult.length + " results.");
    return arrResult;
}





/////////////
// HANDLERS

nz.dynatree.checkboxLeaf_onClick = function (event) {
    var prefix = "nz.dynatree.checkboxLeaf_onClick() - ";
    nz.dynatree.log(prefix + "Entering");

    var cbId = this.id;
    var cb = document.getElementById(cbId);

    if (fc.utils.isInvalidVar(cb)) {
        nz.dynatree.error(prefix + "Could not retrieve element using id of >" + cbId + "<");
        return;
    }

    var path = cb.getAttribute("data-path");
    var sTreeId = cb.getAttribute("data-tree");

    // If MultiSelect is true, the checking and unchecking
    // of a leaf is independent, and no action is required.
    // If MultiSelect is false ie mode is SingleSelect,
    // then checking a leaf box unchecks all other boxes.
    if (!nz.dynatree[sTreeId]["bMultiSelect"]) {
        nz.dynatree.checkboxSingleSelect(sTreeId, path, cb.checked);
    }

    nz.dynatree.callCallback_onCheckedChanged(sTreeId);

    nz.dynatree.log(prefix + "Exiting");
}

nz.dynatree.checkboxBranch_onClick = function (event) {
    var prefix = "nz.dynatree.checkboxBranch_onClick() - ";
    nz.dynatree.log(prefix + "Entering");

    var cbId = this.id;
    var cb = document.getElementById(cbId);

    if (fc.utils.isInvalidVar(cb)) {
        nz.dynatree.error(prefix + "Could not retrieve element using id of >" + cbId + "<");
        return;
    }

    var path = cb.getAttribute("data-path");
    var sTreeId = cb.getAttribute("data-tree");

    // Action depends on whether tree is MultiSelect or SingleSelect
    if (nz.dynatree[sTreeId]["bMultiSelect"]) {
        nz.dynatree.checkboxMultiSelect(sTreeId, path, cb.checked);
    }
    else {
        nz.dynatree.checkboxSingleSelect(sTreeId, path, cb.checked);
    }

    nz.dynatree.callCallback_onCheckedChanged(sTreeId);

    nz.dynatree.log(prefix + "Exiting");
}

nz.dynatree.btnExpand_onClick = function (event) {
    var prefix = "nz.dynatree.btnExpand_onClick() - ";
    nz.dynatree.log(prefix + "Entering");

    var btnId = this.id;
    var btn = document.getElementById(btnId);
    if (fc.utils.isInvalidVar(btn)) {
        nz.dynatree.error(prefix + "Could not retrieve element using id of >" + btnId + "<");
        return;
    }

    var sTreeId = btn.getAttribute("data-tree");
    var path = btn.getAttribute("data-path");

    // Expand or Contract this branch based on current state
    nz.dynatree.toggleBranch(sTreeId, path);

    nz.dynatree.log(prefix + "Exiting");
}



///////////////////
// INITIALISATION

// Set the tree checkboxes to a starting state, from saved data.
// Expected input is an array of strings, either paths or keys.
// Path match is attempted first, falling back to key match.
nz.dynatree.Init = function (sTreeId, arrData, bMatchPath, bMatchKey) {
    var prefix = "nz.dynatree.Init() - ";
    nz.dynatree.log(prefix + "Entering");

    // Sanity
    if (fc.utils.isInvalidVar(arrData)) {
        nz.dynatree.error(prefix + "Data object argument passed was not a valid variable.");
        return;
    }

    if (!(arrData instanceof Array)) {
        nz.dynatree.error(prefix + "Data object argument passed was not an array.");
        return;
    }

    var bMultiSelect = nz.dynatree[sTreeId]["bMultiSelect"];
    if (!bMultiSelect && arrData.length != 1) {
        nz.dynatree.error(prefix + "Data array length should be 1 for a SingleSelect tree; Array length was " + arrData.length);
        return;
    }

    // Defaults
    var bMatchPath = (typeof bMatchPath === "undefined") ? true : bMatchPath; // Default syntax; Default to true
    var bMatchKey = (typeof bMatchKey === "undefined") ? true : bMatchKey; // Default syntax; Default to true


    // Get the root of the tree
    var tree = document.getElementById(sTreeId);
    if (fc.utils.isInvalidVar(tree)) {
        nz.dynatree.error(prefix + "Could not retrieve element using id of >" + sTreeId + "<");
        return;
    }

    // Get the checkboxes and iterate over them.
    // If the path or key match an item in the input list, check the box.
    var inputElements = tree.getElementsByTagName("input");
    var inputElementsLength = inputElements.length;
    var i = 0;
    for (; i < inputElementsLength; ++i) {
        var inputElement = inputElements[i];
        if (inputElement.type == "checkbox") {

            var path = inputElement.getAttribute("data-path");
            var key = inputElement.getAttribute("data-key");
            var dataNodeType = inputElement.getAttribute("data-nodeType");

            if ((bMatchPath && nz.dynatree.arrayContains(arrData, path)) ||
                (bMatchKey && nz.dynatree.arrayContains(arrData, key))) {

                // Found: path or key are in the array of things that should be checked, so check this checkbox.
                nz.dynatree.log(prefix + "Found: path=" + path + ", key=" + key);

                // Action depends on whether tree is MultiSelect or SingleSelect
                inputElement.checked = true;
                if (bMultiSelect) {
                    // Only branches need to have the check propagated to children
                    if (dataNodeType == nz.dynatree.config.sDataNodeTypeBranch) {
                        nz.dynatree.checkboxMultiSelect(sTreeId, path, true);
                    }
                }
                else {
                    nz.dynatree.checkboxSingleSelect(sTreeId, path, true);
                }
            }
        }
    }

    nz.dynatree.log(prefix + "Exiting");
}


// Get the index of an item in an array.
// Returns numeric index on success, or -1 on failure.
nz.dynatree.arrayIndexOf = function (arrData, key) {
    var index = -1;
    var i = 0;
    for (; i < arrData.length; ++i) {
        if (arrData[i] === key) {
            index = i;
            break;
        }
    }
    return index;
}

nz.dynatree.arrayContains = function (arrData, key) {
    var index = nz.dynatree.arrayIndexOf(arrData, key);
    return (index != -1);
}




/////////////
// CALLBACK

nz.dynatree.SetCallback_onCheckedChanged = function (sTreeId, fnCallback) {
    var prefix = "nz.dynatree.SetCallback_onCheckedChanged() - ";
    nz.dynatree.log(prefix + "Entering");

    // Sanity
    if (fc.utils.isInvalidVar(fnCallback)) {
        nz.dynatree.error(prefix + "Callback function argument is not a valid variable.");
        return;
    }

    if (typeof fnCallback !== "function") {
        nz.dynatree.error(prefix + "Callback function argument is not of type function, it is type " + (typeof fnCallback) + ".");
        return;
    }

    // Now confirmed that we have a function.
    nz.dynatree[sTreeId]["fnCallback_onCheckedChanged"] = fnCallback;

    nz.dynatree.log(prefix + "Exiting; Callback function saved.");
}

nz.dynatree.callCallback_onCheckedChanged = function (sTreeId) {
    var prefix = "nz.dynatree.callCallback_onCheckedChanged() - ";
    nz.dynatree.log(prefix + "Entering");

    if (fc.utils.isInvalidVar(sTreeId)) {
        nz.dynatree.error(prefix + "Function called without tree id.");
        return;
    }

    // Get the callback fn
    var fnCallback = nz.dynatree[sTreeId]["fnCallback_onCheckedChanged"];

    if (fc.utils.isInvalidVar(fnCallback)) {
        nz.dynatree.log(prefix + "Exiting; No callback function has been set for tree " + sTreeId);
        return;
    }

    if (typeof fnCallback !== "function") {
        // This should never be called, because we check that the function is 
        // really a function when we save it;  This is belt and braces...
        nz.dynatree.error(prefix + "Saved Callback function is not of type function, it is type " + (typeof fnCallback) + ".");
        return;
    }

    // Got a valid callback function.

    nz.dynatree.log(prefix + "Calling callback function for onCheckedChanged event...");

    try {
        fnCallback(sTreeId);
    }
    catch (ex) {
        var msgException = "Failed during callback for onCheckedChanged event with exception: " + ex.message;
        nz.dynatree.error(prefix + msgException);
    }

    nz.dynatree.log(prefix + "Exiting; Returned from callback function for onCheckedChanged event.");
}



///////////////////////////
// TURN LEAVES INTO LINKS

nz.dynatree.LinkifyLeaves = function (sTreeId, sLinkTemplate, sLinkSubstituteKey) {
    var prefix = "nz.dynatree.LinkifyLeaves() - ";
    nz.dynatree.log(prefix + "Entering");

    // Get the root of the tree
    var tree = document.getElementById(sTreeId);
    if (fc.utils.isInvalidVar(tree)) {
        nz.dynatree.error(prefix + "Could not retrieve element using id of >" + sTreeId + "<");
        return;
    }

    // Sanity...

    // Link Template must be valid non empty string
    if (fc.utils.isInvalidVar(sLinkTemplate)) {
        nz.dynatree.error(prefix + "Link Template string argument is not a valid variable.");
        return;
    }

    if (fc.utils.isEmptyStringOrWhiteSpace(sLinkTemplate)) {
        nz.dynatree.error(prefix + "Link Template string argument is empty string.");
        return;
    }

    // Link Substitute Key must be valid non empty string
    if (fc.utils.isInvalidVar(sLinkSubstituteKey)) {
        nz.dynatree.error(prefix + "Link SubstituteKey string argument is not a valid variable.");
        return;
    }

    if (fc.utils.isEmptyStringOrWhiteSpace(sLinkSubstituteKey)) {
        nz.dynatree.error(prefix + "Link SubstituteKey string argument is empty string.");
        return;
    }

    // Retrieve style definition
    var styleDefn = nz.dynatree[sTreeId]["styleDefn"];


    // At this point...
    // Got a tree, a template string and a subs key


    // Get all leaf list items
    var selector = "li[data-nodeType=" + nz.dynatree.config.sDataNodeTypeLeaf + "]";
    var LIs = tree.querySelectorAll(selector);

    var length = LIs.length;
    var i = 0;
    for (; i < length; ++i) {
        var li = LIs[i];

        // Iterate the children of the list item and find the text node
        var j = 0;
        for (; j < li.childNodes.length; ++j) {
            var node = li.childNodes[j];
            if (node.nodeName === "#text") {
                // Found the first text node.
                // Append an anchor element to this ListItem, and append the 
                // the text node to the anchor element.

                var nextSiblingNode = node.nextSibling;

                var liText = node.nodeValue;

                // Insert the substitution text to build the link text
                var link = sLinkTemplate.replace(sLinkSubstituteKey, liText);
                var uriLink = encodeURI(link);

                var anchor = document.createElement("a");
                anchor.setAttribute("href", uriLink);
                anchor.className = styleDefn["anchorClass"] || "";

                // Insert the anchor in the list item with the text node beneath it
                anchor.appendChild(node);
                li.insertBefore(anchor, nextSiblingNode);

                break;
            }
        }
    }


    nz.dynatree.log(prefix + "Exiting");
}



///////////////////////
// SOURCE INSPIRATION

// Called with every property and it's value
/*
nz.dynatree.process = function (key, value, depth) {
    if (typeof value == "object") {
        nz.dynatree.log("BRANCH NODE (" + depth + "): " + key);
    }
    else {
        nz.dynatree.log("LEAF NODE (" + depth + "): " + key + " : " + value);
    }
}
*/

// Traverse the JS object, recording depth level
/*
nz.dynatree.traverse = function (o, fn, depth) {
    var depth = (typeof depth === "undefined") ? 0 : depth; // Default syntax
    for (var i in o) {
        if (o[i] !== null) {
            if (typeof (o[i]) == "object") {
                // Stepping down a level in the tree
                nz.dynatree.traverse(o[i], fn, depth + 1);
            }
        }
    }
}
*/

