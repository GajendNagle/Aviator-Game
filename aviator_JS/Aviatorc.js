          
          
          
           function deleteCookie(name) {
              document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
            
            
            
            function setCookie(name, value, days) {
              var expires = "";
              if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
              }
              document.cookie = name + "=" + (value || "")  + expires + "; path=/";
            }
            
            
            function getCookie(name) {
              var cookies = document.cookie.split(';');
              for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                  return cookie.substring(name.length + 1);
                }
              }
              return null;
            }
            
             setCookie('mult_no', 0, 1); 
         
            window.addEventListener('beforeunload', function() {
              deleteCookie('mult_no');
            });