using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;

using System.IO;
public class DB
{
	public DB()
	{
		//
		// TODO: Add constructor logic here
		//
	}
    public string getconnection()
    {
        string Cn = System.Configuration.ConfigurationManager.ConnectionStrings["ConDB"].ConnectionString;
        return Cn;
    }
    public static void WriteLog(string _msg)
    {
        string filepath;
        filepath = HttpContext.Current.Server.MapPath("~/Acc56Err_File65.aspx");
        if (System.IO.File.Exists(filepath))
        {
            using (StreamWriter writer = new StreamWriter(HttpContext.Current.Server.MapPath("~/Acc56Err_File65.aspx"), true))
            {
                //for writing time....

                writer.Write("<br>" + "[<b style='color:Red;'>Date:</b> " + DateTime.Now.ToLongDateString() + "] & [<b style='color:Red;'>Time:</b> " + DateTime.Now.ToLongTimeString() + "]");
                writer.WriteLine();
                //actual write cintent.....            

                writer.Write("<br>" + ReplaceVal(_msg));
                writer.WriteLine();
                //For Record Sepration....            

                writer.WriteLine("<br><hr>");
                writer.Close();
            }
        }
        else
        {
            System.IO.StreamWriter sw = System.IO.File.CreateText(filepath);
            //for writing time....            

            using (StreamWriter writer = new StreamWriter(HttpContext.Current.Server.MapPath("~/Acc56Err_File65.aspx"), true))
            {

                //for writing time....

                writer.Write("[<b style='color:Red;'>Date:</b> " + DateTime.Now.ToLongDateString() + "] & [<b style='color:Red;'>Time:</b> " + DateTime.Now.ToLongTimeString() + "]");
                writer.WriteLine();

                //actual write cintent.....            

                writer.Write("<br>" + ReplaceVal(_msg));
                writer.WriteLine();
                //For Record Sepration....            

                writer.WriteLine("<br><hr>");
                writer.Close();
            }
        }
    }
    
    public static string ReplaceVal(string msg)
    {
        string Msg = "";
        Msg = msg;
        Msg.Replace(@"at System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection)
   at System.Data.SqlClient.SqlInternalConnection.OnError(SqlException exception, Boolean breakConnection)
   at System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj)
   at System.Data.SqlClient.TdsParser.Run(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj)
   at System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async)
   at System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(DbAsyncResult result, String methodName, Boolean sendToPipe)
   at System.Data.SqlClient.SqlCommand.ExecuteNonQuery()", "").Replace("Error Msg :", "<b style='color:Red;'>Error Msg :</b>").Replace("Event Info :", "<b style='color:Red;'>Event Info :</b>");

        return Msg;
    }
}