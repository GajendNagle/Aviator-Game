<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SignIn.aspx.cs" Inherits="SignIn" %>

<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aviator - Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="Login/css/style.css">
    <link rel="stylesheet" href="Login/css/animations.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap">
</head>
<body >
    <div class="aviator-bg">
        <div class="airplane-container">
            <div class="airplane"></div>
        </div>
        <div class="stars"></div>
    </div>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="login-container">
                    <div class="logo-container text-center mb-4">
                        <div class="logo">
                            <div class="logo-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane">
                                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                                </svg>
                            </div>
                            <h1>AVIATOR</h1>
                        </div>
                        <p class="tagline">Ready for takeoff</p>
                    </div>
                    <form id="loginForm" runat="server">
                        <div class="form-group mb-4">
                            <label for="username">Username or Email</label>
                            <asp:TextBox runat="server"  class="form-control" ID="username"></asp:TextBox>
                            <div class="invalid-feedback">Please enter your username or email</div>
                        </div>

                        <div class="form-group mb-3">
                            <label for="password">Password</label>
                            <div class="password-container">
                                <asp:TextBox runat="server" TextMode="Password" class="form-control" ID="password"></asp:TextBox>
                                <button type="button" class="toggle-password" id="togglePassword">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                                <div class="invalid-feedback">Please enter your password</div>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="rememberMe">
                                    <label class="form-check-label" for="rememberMe">Remember me</label>
                                </div>
                            </div>
                            <div class="col text-end">
                                <a href="#" class="forgot-password">Forgot Password?</a>
                            </div>
                        </div>
                        <asp:Button type="submit" OnClick="btnLogin_Click" ID="btnLogin" CssClass="btn btn-login w-100" runat="server" Text="LOG IN" />
                        <div class="divider my-4">
                            <span>OR</span>
                        </div>
                        <p class="text-center signup-text">
                            Don't have an account? <a href="#">Sign Up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="GamePlay.js"></script>
 <%--   <script>
        updateRoundInfo();
    </script>--%>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="Login/JS/main.js"></script>
</body>
</html>
