using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Web.Script.Serialization; // JSON De/Serialisation


public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            hfContractTree.Value = getContractTree();
        }
    }

    /* V1 - Too much data; We have a contract dictionary with data on the contract,
     *      and this data becomes the leaves.  Instead, we want the symbol itself
     *      to be the leaf.
    public static string getContractTree()
    {
        string sReturn = "";

        // Set up some dummy data for testing

        List<Tuple<string,string>> paths = new List<Tuple<string,string>>();
        paths.Add(new Tuple<string, string>("A-JAN2015", "/COMPANYNAME/AUCTION"));
        paths.Add(new Tuple<string, string>("B-JAN2015", "/COMPANYNAME/AUCTION"));
        paths.Add(new Tuple<string, string>("C-JAN2015", "/COMPANYNAME/AUCTION"));
        paths.Add(new Tuple<string, string>("A-JAN2015", "/COMPANYNAME/CONTINUOUS"));
        paths.Add(new Tuple<string, string>("B-JAN2015", "/COMPANYNAME/CONTINUOUS"));
        paths.Add(new Tuple<string, string>("C-JAN2015", "/COMPANYNAME/CONTINUOUS"));
        paths.Add(new Tuple<string, string>("DEC2014", "/OTHER/AUCTION"));
        paths.Add(new Tuple<string, string>("MAR2014", "/OTHER/AUCTION"));
        paths.Add(new Tuple<string, string>("JAN2014", "/OTHER/AUCTION"));
        paths.Add(new Tuple<string, string>("DEC2014", "/OTHER/CONTINUOUS/CAT-A"));
        paths.Add(new Tuple<string, string>("MAR2015", "/OTHER/CONTINUOUS/CAT-A"));
        paths.Add(new Tuple<string, string>("JUN2015", "/OTHER/CONTINUOUS/CAT-A"));
        paths.Add(new Tuple<string, string>("DEC2014", "/OTHER/CONTINUOUS/CAT-B"));
        paths.Add(new Tuple<string, string>("MAR2015", "/OTHER/CONTINUOUS/CAT-B"));
        paths.Add(new Tuple<string, string>("JUN2015", "/OTHER/CONTINUOUS/CAT-B"));

        char delimiter = '/';

        Dictionary<string, object> dicContractTree = new Dictionary<string, object>();

        foreach (Tuple<string,string> pairSymbolPath in paths)
        {
            string symbol = pairSymbolPath.Item1;
            string path = pairSymbolPath.Item2;

            Dictionary<string, object> dicContractData = getContractData(symbol);

            string[] arrayPath = path.Split(delimiter);
            string[] arrayPathCleaned = getCleanArrayPath(arrayPath, symbol);

            Dictionary<string, object> dicPointer = dicContractTree;
            foreach (string folder in arrayPathCleaned)
            {
                object obj;
                if (dicPointer.TryGetValue(folder, out obj))
                {
                    // Dictionary exists;
                    // Move the pointer to it.
                    dicPointer = (Dictionary<string, object>)obj;
                }
                else
                {
                    // Dictionary does not exist;
                    // Create dictionary and move pointer to it.
                    dicPointer[folder] = new Dictionary<string,object>();
                    dicPointer = (Dictionary<string, object>)dicPointer[folder];
                }                
            }

            // Add the data dictionary wherever the pointer ends up
            dicPointer[symbol] = dicContractData;
        }

        // Serialize the contract tree and return
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        sReturn = serializer.Serialize(dicContractTree);        

        return sReturn;
    }
    */

    // V2 - Symbol is the leaf
    public static string getContractTree()
    {
        string sReturn = "";

        // Set up some dummy data for testing

        List<Tuple<string,string>> paths = new List<Tuple<string,string>>();
        paths.Add(new Tuple<string, string>("A-JAN2015", "/COMPANYNAME/AUCTION"));
        paths.Add(new Tuple<string, string>("B-JAN2015", "/COMPANYNAME/AUCTION"));
        paths.Add(new Tuple<string, string>("C-JAN2015", "/COMPANYNAME/AUCTION"));
        paths.Add(new Tuple<string, string>("A-JAN2015", "/COMPANYNAME/CONTINUOUS"));
        paths.Add(new Tuple<string, string>("B-JAN2015", "/COMPANYNAME/CONTINUOUS"));
        paths.Add(new Tuple<string, string>("C-JAN2015", "/COMPANYNAME/CONTINUOUS"));
        paths.Add(new Tuple<string, string>("DEC2014", "/OTHER/AUCTION"));
        paths.Add(new Tuple<string, string>("MAR2014", "/OTHER/AUCTION"));
        paths.Add(new Tuple<string, string>("JAN2014", "/OTHER/AUCTION"));
        paths.Add(new Tuple<string, string>("DEC2014", "/OTHER/CONTINUOUS/CAT-A"));
        paths.Add(new Tuple<string, string>("MAR2015", "/OTHER/CONTINUOUS/CAT-A"));
        paths.Add(new Tuple<string, string>("JUN2015", "/OTHER/CONTINUOUS/CAT-A"));
        paths.Add(new Tuple<string, string>("DEC2014", "/OTHER/CONTINUOUS/CAT-B"));
        paths.Add(new Tuple<string, string>("MAR2015", "/OTHER/CONTINUOUS/CAT-B"));
        paths.Add(new Tuple<string, string>("JUN2015", "/OTHER/CONTINUOUS/CAT-B"));

        char delimiter = '/';

        Dictionary<string, object> dicContractTree = new Dictionary<string, object>();

        foreach (Tuple<string,string> pairSymbolPath in paths)
        {
            string symbol = pairSymbolPath.Item1;
            string path = pairSymbolPath.Item2;

            string[] arrayPath = path.Split(delimiter);
            string[] arrayPathCleaned = getCleanArrayPath(arrayPath, symbol);

            Dictionary<string, object> dicPointer = dicContractTree;
            foreach (string folder in arrayPathCleaned)
            {
                object obj;
                if (dicPointer.TryGetValue(folder, out obj))
                {
                    // Dictionary exists;
                    // Move the pointer to it.
                    dicPointer = (Dictionary<string, object>)obj;
                }
                else
                {
                    // Dictionary does not exist;
                    // Create dictionary and move pointer to it.
                    dicPointer[folder] = new Dictionary<string,object>();
                    dicPointer = (Dictionary<string, object>)dicPointer[folder];
                }                
            }

            // Add the symbol wherever the pointer ends up
            dicPointer[symbol] = "Tooltip for Symbol " + symbol + "\r\nSecond Line Info";
        }

        // Serialize the contract tree and return
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        sReturn = serializer.Serialize(dicContractTree);        

        return sReturn;
    }


    public static string[] getCleanArrayPath(string[] arrayPath, string symbol)
    {
        List<string> listPath = new List<string>();
       
        // Deal with possible double slashes or spurious slashes
        foreach (string path in arrayPath)
        { 
            if (!string.IsNullOrWhiteSpace(path))
                listPath.Add(path);
        }

        // Deal with possible inclusion of the symbol name in the path (like files)
        if (listPath.Any())
        {            
            if (listPath.Last() == symbol)
                listPath.Remove(symbol);
        }

        return listPath.ToArray();
    }

    /* Surplus test code
    public static Dictionary<string, object> getContractData(string symbol)
    {
        Dictionary<string, object> dic = new Dictionary<string, object>();

        string name = symbol + "_ContractName";
        dic["Name"] = (object)name;

        string currency = "EUR";
        dic["Currency"] = (object)currency;

        string expiration = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
        dic["Expiration"] = (object)expiration;

        return dic;
    }
    */ 

}