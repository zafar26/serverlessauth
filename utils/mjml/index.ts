import mjml2html from 'mjml'

/*
  Compile an mjml string
*/
export const confirmationMjml =(username,useremail,mode, link) => {

    let verification = "Email Verification"
    let name = username ? username : "ZAFAR"
    let email = useremail ? useremail : "qutubuddinzafar2616118@gmail.com"
    let confirmationLink = link ? link : "https://something.com"
    let logo="https://image.shutterstock.com/image-vector/lp-letter-logo-260nw-1068631178.jpg"
    let location = "45.117.66.26 at 12:38 UTC in Karimnagar, India"


    return mjml2html(`
    <mjml>
        <mj-body >
            <mj-section  css-class= "confirmation" >
                <mj-raw>
                    <!-- Company Header -->
                </mj-raw>
                <mj-section >
                    <mj-column width="220px">
                        <mj-image width=100px height=100px src=${logo}></mj-image>    
                        <mj-text font-size="20px" color="#626262">${verification}</mj-text>
                    </mj-column>      
                </mj-section>    
                <mj-section >
                    <mj-column width="80%">
                        <mj-text >
                            Hello ${name},
                        </mj-text >
            
                        <mj-text >
                            We have received a request to create your Leapwind account email address 
                            is <a href="">${email}</a>
                        </mj-text>
                        <mj-text >
                            The request originated from ${location}. 
                        </mj-text>
                        <mj-text >
                            To complete the email change process, please click the button below:
                            <br>
                        </mj-text>
                    </mj-column>
                    <mj-column>
                        <mj-button width="180px" height="50px" background-color="black" href=${confirmationLink}>Confirm</mj-button>
                    </mj-column>
                </mj-section>
                <mj-section>
                    <mj-column width="80%">
                        <mj-text >
                            Or copy and paste this URL into a new tab of your browser:<br><br>
                            <a href="">${confirmationLink}</a>
                        </mj-text >
                        <mj-text color="gray">
                            If you did not requested for creating email, 
                            or if the location does not match, 
                            please ignore this email. 
                            If you are concerned about your account's safety, 
                            please reply to this email to get in touch with us.
                        </mj-text>
                    </mj-column>
                </mj-section>
            </mj-section >
        </mj-body>
    </mjml>
    `)
}
