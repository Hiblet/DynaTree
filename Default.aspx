<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <%-- <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script> --%>
    <script type="text/javascript" src="<%= ResolveClientUrl("~/JQuery/jquery-1.11.1.min.js") %>"></script>

    <script type="text/javascript" src="<%= ResolveClientUrl("~/js/FCUtils.js") %>"></script>
    <script type="text/javascript" src="<%= ResolveClientUrl("~/js/DynaTree.js") %>"></script>
    <script type="text/javascript" src="<%= ResolveClientUrl("~/js/Default.js") %>"></script>

    <link rel="Stylesheet" type="text/css" href="<%= ResolveClientUrl("~/Default.css") %>" />    

    <title>DynaTree Experiment</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>

        <asp:HiddenField runat="server" ID="hfContractTree" />


        <%-- List Example --%>
        <%--
        <ul class="ulTestClass">
            <li class="liTestClass">
                Item 1
                <ul class="ulTestClass">
                    <li class="liTestClass">
                        Item 1.1
                    </li>
                </ul>
            </li>
            <li class="liTestClass">
                Item 2
                <ul class="ulTestClass">
                    <li class="liTestClass">
                        Item 2.1
                    </li>
                    <li class="liTestClass">
                        Item 2.2
                        <ul class="ulTestClass">
                            <li class="liTestClass">
                                Item 2.2.1
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="liTestClass">
                Item 3
            </li>
        </ul>

        <br />
        <br />
        --%>


        <%-- The target container to hold the tree --%>
        <div id="divContainer">
        </div>

        <br />

        <%-- Test Buttons --%>
        <div id="divFeedback">FEEDBACK</div>
        <br />
        <input type="button" id="btnLeaves" value="Leaves" />
        <input type="button" id="btnBranches" value="Branches" />
        <input type="button" id="btnBoth" value="Both" />
            
    </div>
    </form>
</body>
</html>
