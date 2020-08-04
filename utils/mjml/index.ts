import mjml2html from "mjml";

/*
  Compile an mjml string
*/
export const confirmationLinkEmail = (projectName, email, mode, link) => {
    return mjml2html(
        `<mjml>
            <mj-body>
                <mj-section>
                <mj-column width="100%">
                    <mj-text align="center" color="#5a67d8" font-family="Helvetica" font-size="24px" font-weight="bold">Verify Your Email</mj-text>
                </mj-column>
                <mj-column width="80%">
                    <mj-spacer></mj-spacer>
                    <mj-text font-family="Helvetica" font-size="16px">Hello ${email},</mj-text>
                    <mj-text font-family="Helvetica" font-size="14px">We have received a ${mode} attempt at ${projectName},</mj-text>
                    <mj-text font-family="Helvetica" font-size="14px" font-weight="bold">To complete the ${mode} process, please click the button below:</mj-text>
                    <mj-button font-family="Helvetica" background-color="#5a67d8" font-weight="bold" href=${link} target="_blank" width="100%" color="white">VERIFY</mj-button>
                </mj-column>
                <mj-column width="80%">
                    <mj-text font-family="Helvetica" font-size="14px" font-weight="bold">OR copy and paste this URL into a new tab of your browser:</mj-text>
                    <mj-text color="#067df7"><a href=${link} target="_blank">${link}</a></mj-text>
                    <mj-spacer></mj-spacer>
                    <mj-divider border-width="1px" border-color="lightgrey"></mj-divider>
                    <mj-text color="gray" font-family="Helvetica">If you didn't attempted to ${mode}, please ignore this email.</mj-text>
                </mj-column>
                </mj-section>
            </mj-body>
        </mjml>`
    );
};
