<%@ WebHandler Language="C#" Class="BetHistoryUpdate" %>

using System;
using System.Web;
using System.Data;
using System.Web.Script.Serialization;

public class BetHistoryUpdate : IHttpHandler
{
    public HttpContext context;
    public HttpRequest request;
    public HttpResponse response;
    public bool sc;
    public static string msg = "", RoundStatus = "", RoundNo = "", CrashMulti;
    public float crashMultiplier;
    DynamicDtls objgdb = new DynamicDtls();
    DataSet ds;

    public class ResponseModel
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public void ProcessRequest(HttpContext _context)
    {
        context = _context;
        request = _context.Request;
        response = _context.Response;
        response.ContentType = "application/json";

        string action = request["action"];
        var serializer = new JavaScriptSerializer();
        ResponseModel res = new ResponseModel();
        HttpCookie LoginID = context.Request.Cookies["LoginID"];
        if (LoginID != null && (!string.IsNullOrEmpty(LoginID.Value)))
        {

            if (action == "recordCrash")
            {
                try
                {
                    RoundNo = request["roundNo"];
                    RoundStatus = request["roundStatus"];
                    CrashMulti = request["multiplier"];
                    if (RoundStatus == "CloseRound")
                    {
                        recordCrash();
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        response.Write(serializer.Serialize(res));
    }

    public void recordCrash()
    {
        try
        {

            ds = objgdb.ByProcedure("[Avtr_ProRecordBetPlay]", new string[]
            { "Action", "MemId", "RoundNo", "Bet", "BetAmount", "Multi", "Result_Status" }, new string[]
            { RoundStatus, "", RoundNo, "", "0",CrashMulti.ToString() , ""}, "das");

            if (ds.Tables[0] != null && ds.Tables[2].Rows[0]["Rlt"].ToString() == "IsOk")
            {
                sc = true;
                msg = ds.Tables[2].Rows[0]["msg"].ToString();
            }
            else
            {
                sc = false;
                msg = ds.Tables[2].Rows[0]["msg"].ToString();
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
    public void RoundRunningStatusSend()
    {
        DataSet ds = null;
        try
        {
            ds = objgdb.ByProcedure("[dbo.Avtr_ProStartNewRound]",
                new string[] { "CurrentRoundNo", "NewRoundNo", "Round_Status" },
                new string[] { RoundNo, "", RoundStatus },
                "dataset");

            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    var resultRow = ds.Tables[0].Rows[0];
                    sc = (resultRow["Rlt"].ToString() == "IsOk");
                    msg = resultRow["Error_msg"].ToString();
                }
                else
                {
                    sc = false;
                    msg = "No result rows returned";
                }
            }

        }

        catch (Exception ex)
        {
            DB.WriteLog(this.ToString() + " Error Msg :" + ex.Message + "\n" + "Event Info :" + ex.StackTrace);
            sc = false;
            msg = "Sorry, Something is wrong please try later !";
        }
        finally
        {
            ds.Dispose();
        }
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}
