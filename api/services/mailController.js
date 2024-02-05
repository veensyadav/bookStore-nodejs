const sgMail = require('@sendgrid/mail');
const key = process.env.SENDGRID_API_KEY;
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
    maxConcurrent: 1, // Number of emails sent concurrently
    minTime: 60000 / 100, // 1 minute divided by 100 (limit to 100 emails per minute)
});

exports.ClientPurchaseInfo = (book, authorEmail, purchaseData, retailerEmail) => {
    sgMail.setApiKey(key);
    const msg = {
        to: retailerEmail,
        cc: authorEmail,
        from: 'praveen18020@gmail.com', // verified sender
        subject: 'Invoice Details',
        text: 'and easy to do anywhere, even with Node.js',
        html: `
        <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Details</title>
    
  </head>
  
  <body>
    <table
      style="width: 100%; max-width: 600px; margin: 0 auto; padding: 15px; background: #f8f8f8; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
      cellspacing="0" borderspacing="0">
      <tr>
        <td>
          <table style="background: white; padding: 28px 38px; width: 100%;">
            <tr>
              <td style="padding-top: 35px;">
                <table style="text-align: left; width: 100%;">
                  <tr>
                    <td>
                      <div style="display: block;">
                        <span style="font-size: 16px; margin: 0 0 4px; display: block;">
                          Dear ${authorEmail},
                        </span>
                        <span style="font-size: 16px;">
                          Here is the invoice of recent purchase.
                        </span>
                      </div>
                      <div style="border-top: 1px solid #c2c2c2; margin-top: 20px;">
                        <h3 style="font-weight: 500; font-size: 16px; line-height: 24px; color: #666666;">Invoice Details
                        </h3>
                      </div>
                      <table style="margin-top: 20px; width: 100%;" borderSpacing="0" cellSpacing="0">
                        <thead>
                          <tr>
                            <th
                              style="font-weight: 500; font-size: 14px; line-height: 24px; color: #000000; width: 35%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              Date
                            </th>
                            <th
                              style="font-weight: 500; font-size: 14px; line-height: 24px; color: #000000; width: 35%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              Tittle
                            </th>
                            <th
                              style="font-weight: 500; font-size: 14px; line-height: 24px; color: #000000; width: 20%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              Quantity
                            </th>
                            <th
                              style="font-weight: 500; font-size: 14px; line-height: 24px; color: #000000; width: 35%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              Price
                            </th>
                            <th
                              style="font-weight: 500; font-size: 14px; line-height: 24px; color: #000000; width: 35%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              SUBTOTAL
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style="font-weight: 400; font-size: 14px; line-height: 24px; color: #000000; width: 35%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              ${purchaseData.purchaseDate.toISOString().replace(/\..+/g, '')}
                            </td>
                            <td
                              style="font-weight: 400; font-size: 14px; line-height: 24px; color: #000000; width: 20%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              ${book.title}
                            </td>
                            <td
                              style="font-weight: 400; font-size: 14px; line-height: 24px; color: #000000; width: 35%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              ${purchaseData.quantity}
                            </td>
                            <td
                              style="font-weight: 400; font-size: 14px; line-height: 24px; color: #000000; width: 35%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              $ ${book.price}
                            </td>
                            <td
                              style="font-weight: 400; font-size: 14px; line-height: 24px; color: #000000; width: 35%; border-bottom: 1px solid #d6d6d6; padding: 10px 5px;">
                              $ ${purchaseData.price}
                            </td>
                          </tr>                    
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  
  </html>
        `
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
            return error
        });
};


exports.bookReleaseNotif = async (newBook, retailersEmails) => {
    sgMail.setApiKey(key);
    for (const mailId of retailersEmails) {
        const msg = {
            to: mailId,
            from: 'praveen18020@gmail.com',
            subject: 'New Book Released',
            text: 'and easy to do anywhere, even with Node.js',
            html: `
                <html lang="en">    
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Book Release Notification</title>
                    </head>

                    <body>
                        <div style="max-width: 600px; margin: 0 auto; padding: 15px; background: #f8f8f8; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                            <h2 style="text-align: center; color: #333;">New Book Released!</h2>

                            <div style="background: white; padding: 28px 38px;">
                                <h3 style="font-size: 18px; color: #333;">Book Details:</h3>

                                <p><strong>Title:</strong> ${newBook.title}</p>
                                <p><strong>Authors:</strong> ${newBook.authors}</p>
                                <p><strong>Description:</strong> ${newBook.description}</p>
                                <p><strong>Price:</strong> $ ${newBook.price}</p>

                                <p style="margin-top: 20px;">Thank you for using our service!</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        try {
            await limiter.schedule(() => sgMail.send(msg));
            console.log('Email sent');
        } catch (error) {
            console.error(error);
            return error;
        }
    }
};


exports.authorRevenueDetails = async (totalRevenue) => {
    sgMail.setApiKey(key);
    console.log("Hello");
    for (const emailId of totalRevenue.authorEmails) {
        const msg = {
            to: emailId,
            from: 'praveen18020@gmail.com',
            subject: 'New Book Released',
            text: 'and easy to do anywhere, even with Node.js',
            html: `
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Revenue Details</title>
            </head>

            <body>
                <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 15px; background: #f8f8f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="background: white; padding: 28px 38px; width: 100%;">
                        <div style="text-align: left; width: 100%;">
                            <div>
                                <span style="font-size: 16px; margin: 0 0 4px; display: block;">
                                    Dear ${emailId},
                                </span>
                                <span style="font-size: 16px;">
                                    Here are the revenue details for your book sales.
                                </span>
                            </div>
                            <div style="border-top: 1px solid #c2c2c2; margin-top: 20px;">
                                <h3 style="font-weight: 500; font-size: 16px; line-height: 24px; color: #666666;">Revenue Details</h3>
                            </div>
                            <table style="margin-top: 20px; width: 100%;" borderSpacing="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td style="font-weight: 500; font-size: 14px; line-height: 24px; color: #000000; width: 50%; padding: 10px 5px;">Total Current Monthly Revenue</td>
                                        <td style="font-weight: 400; font-size: 14px; line-height: 24px; color: #000000; width: 50%; padding: 10px 5px;">$ ${totalRevenue.totalMonthlyRevenue}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 500; font-size: 14px; line-height: 24px; color: #000000; width: 50%; padding: 10px 5px;">Total Current Year Revenue</td>
                                        <td style="font-weight: 400; font-size: 14px; line-height: 24px; color: #000000; width: 50%; padding: 10px 5px;">$ ${totalRevenue.totalYearlyRevenue}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 500; font-size: 14px; line-height: 24px; color: #000000; width: 50%; padding: 10px 5px;">Total Revenue Till Today</td>
                                        <td style="font-weight: 400; font-size: 14px; line-height: 24px; color: #000000; width: 50%; padding: 10px 5px;">$ ${totalRevenue.totalRevenueTillToday}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </body>

        </html>
            `
        };

        try {
            await limiter.schedule(() => sgMail.send(msg));
            console.log('Email sent');
        } catch (error) {
            console.error(error);
            return error;
        }
    }
};