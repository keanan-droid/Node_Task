// import nodemailer from "nodemailer";

// let testAccount = await nodemailer.createTestAccount();

// let transporter = nodemailer.createTransport({
//     host: "test",
//     port: 3000,
//     secure: false, 
//     auth: {
//       user: 'test@mail.com', // generated ethereal user
//       password: 'test', // generated ethereal password
//     },
// });

// async function main() {

//   let info = await transporter.sendMail({
//       from: '"Nodemailer contact" <test@mail.com>', // sender address
//       to: "keananshawnswartz@gmail.com", // list of receivers
//       subject: "NEW USER", // Subject line
//       text: "Welcome User", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });

//   console.log("Message sent: %s", info.messageId);

//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// }

//   main().catch(console.error);

// export default {transporter, main}

