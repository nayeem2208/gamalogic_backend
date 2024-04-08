import { SendMailClient } from "zeptomail";

async function zeptomailsend() {
    const url = "zeptomail.zoho.com/";
  const token =process.env.ZEPTOMAIL_TOKEN

  let client = new SendMailClient({ url, token });

  try {
    const resp = await client.sendMail({
      from: {
        address: "nayeem2281998@gmail.com",
        name: "test",
      },
      to: [
        {
          email_address: {
            address: "nayeem670@gmail.com",
            name: "test1",
          },
        },
      ],
      subject: "Sending with ZeptoMail to have good experience",
      textbody: "Easy to do from anywhere, with Node.js",
      htmlbody: "Easy to do from anywhere, with Node.js",
      track_clicks: true,
      track_opens: true,
      client_reference: "",
      mime_headers: {
        "X-Zylker-User": "test-xxxx",
      },
    });
    console.log("Success:", resp);
  } catch (error) {
    console.log("Error:", error);
  }
}

export default zeptomailsend;
