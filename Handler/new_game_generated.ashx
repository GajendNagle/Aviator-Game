<%@ WebHandler Language="C#" Class="new_game_generated" %>

using System;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.SessionState;

public class new_game_generated : IHttpHandler , IRequiresSessionState
{
    public HttpContext context;
    public HttpRequest request;
    public HttpResponse response;
    DataSet ds = new DataSet();
    DynamicDtls Objct = new DynamicDtls();
    float WalletBlnc;
    string UserId;
    string PendingBetA;
    string PendingBetB;
    DataTable dt;
    public string ConDB = ConfigurationManager.ConnectionStrings["ConDB"].ConnectionString;
    public string CurrentRound;
    public void ProcessRequest(HttpContext _context)
    {
        context = _context;
        request = _context.Request;
        response = _context.Response;
        context.Response.ContentType = "application/json";

        /////////
        try
        {
            HttpCookie LoginID = context.Request.Cookies["LoginID"];
            if (LoginID != null && (!string.IsNullOrEmpty(LoginID.Value)))
            {
                UserId = LoginID.Value;
                BindResult();
            }
            else
            {
                WriteJsonResponse(false, "Not Authenticated");
                context.ApplicationInstance.CompleteRequest();
            }
        }
        catch (Exception ex)
        {

            WriteJsonResponse(false, "ERror :" + ex.Message);
        }

    }

    private void BindResult()
    {
        try
        {
            using (SqlConnection con = new SqlConnection(ConDB))
            using (SqlCommand cmd = new SqlCommand("dbo.Avtr_ProStartNewRound", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Memid", UserId.ToString());
                SqlParameter outputParam = new SqlParameter("@NewRoundNo", SqlDbType.VarChar, 25);
                outputParam.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outputParam);
                con.Open();
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                ds.Clear();
                sda.Fill(ds);

                if (ds.Tables.Count > 0)
                {
                    dt = ds.Tables[0];
                    if (dt.Rows.Count > 0)
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            CurrentRound = dt.Rows[0]["CurrentRound"].ToString();
                            PendingBetA = dt.Rows[0]["Bet_A"].ToString();
                            PendingBetB = dt.Rows[0]["Bet_B"].ToString();
                         // WalletBlnc=dt.Rows[0]["GameWalletB"].ToString();
                                WalletBlnc = float.Parse(dt.Rows[0]["GameWalletB"].ToString());

                            if (!string.IsNullOrEmpty(CurrentRound))
                            {
                                WriteJsonResponse(true, "New Round Started", CurrentRound, UserId, WalletBlnc, PendingBetA, PendingBetB);
                            }
                            else
                            {
                                WriteJsonResponse(false, "No round information found.");
                            }
                        }

                    }
                }
            }
        }
        catch (Exception ex)
        {
            WriteJsonResponse(false, "Error: " + ex.Message, UserId: UserId);
        }
    }

    private void WriteJsonResponse(bool success, string message, string roundNo = "", string UserId = "", float WalletBlnc = 0, string BetA = "", string BetB = "")
    {
        var result = new
        {
            Success = success,
            Message = message,
            id = roundNo,
            WalletBlnc = WalletBlnc,
            UserId = UserId,
            PendingBetA = BetA,
            PendingBetB = BetB
        };

        string json = new JavaScriptSerializer().Serialize(result);
        response.Write(json);
    }

    public bool IsReusable
    {
        get { return false; }
    }
}
