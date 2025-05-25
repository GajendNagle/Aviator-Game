using System;
using System.Data;
using System.Configuration;
using System.Data.SqlClient;

public class DynamicDtls
{
    private DataSet ds;
    private DB objdb = new DB();
    private SqlCommand cmd;

    public string Cn;
    public DataTable dt;
    public string _ErrorMessage;

    public DynamicDtls()
    {
    }

    public string ErrorMessage
    {
        get { return _ErrorMessage; }
        set { _ErrorMessage = value; }
    }

    public string getconnection
    {
        get
        {
            try
            {
                Cn = objdb.getconnection();  
            }
            catch
            {
                _ErrorMessage = "Yes";
                throw new Exception("Please Provide Connection Object Name: Conn");
            }
            return Cn;
        }
    }

    public DataSet ByProcedure(string ProcedureName, string[] Parameter, string[] Values, string ByDataSetAlert)
    {
        ds = new DataSet();
        try
        {
            using (SqlConnection cn = new SqlConnection(getconnection))
            {
                cmd = new SqlCommand(ProcedureName, cn);
                cmd.CommandType = CommandType.StoredProcedure;
                for (int i = 0; i < Parameter.Length; i++)
                {
                    cmd.Parameters.AddWithValue("@" + Parameter[i], Values[i]);
                }
                using (SqlDataAdapter adp = new SqlDataAdapter(cmd))
                {
                    adp.Fill(ds);
                }
            }
        }
        catch (Exception ex)
        {
            _ErrorMessage = "Yes";
            throw new Exception("Database Error: " + ex.Message);
        }
        finally
        {
            if (cmd != null)
                cmd.Dispose();
        }
        return ds;
    }
}
