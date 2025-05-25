using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class SignIn : System.Web.UI.Page
{
    public bool sc;
    public static string msg = "";
    DynamicDtls objgdb = new DynamicDtls();
    DataSet ds;
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void btnLogin_Click(object sender, EventArgs e)
    {
        try
        {

            ds = objgdb.ByProcedure("[usp_ValidateUser]", new string[]
            { "UserName", "Password"}, new string[] {
                username.Text.Trim(),password.Text.Trim() }, "das");

            if (ds.Tables[0].Rows[0]["Rlt"].ToString() == "IsOk")
            {
                sc = true;
                msg = ds.Tables[0].Rows[0]["msg"].ToString();
                Response.Redirect("Aviator.html", false);
                Context.ApplicationInstance.CompleteRequest();
                Context.Response.Cookies["LoginID"].Value = ds.Tables[0].Rows[0]["LoginID"].ToString();
                //Context.Response.Cookies["WBlnc"].Value = ds.Tables[0].Rows[0]["WBlnc"].ToString();
            }
            else
            {
                sc = false;
                msg = ds.Tables[0].Rows[0]["msg"].ToString();
            }
        }
        catch (Exception ex)
        {
            DB.WriteLog(this.ToString() + " Error Msg :" + ex.Message + "\n" + "Event Info :" + ex.StackTrace);
            sc = false;
            msg = "Sorry, something went wrong. Please try later.";
        }
        finally
        {
            if (ds != null) ds.Dispose();
        }

    }
}