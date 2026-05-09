// Notify endpoint to confirm Payfast payment
app.post('/Payfast-notify', (req, res) => {
  const data = req.body;
  console.log('Payfast notify received:', data);

  // Verify checksum again for security
  const params = {
    siteCode: data.siteCode,
    countryCode: data.countryCode,
    currencyCode: data.currencyCode,
    amount: data.amount,
    transactionReference: data.transactionReference,
    bankReference: data.bankReference,
    customerEmail: data.customerEmail,
    successUrl: data.successUrl,
    cancelUrl: data.cancelUrl,
    notifyUrl: data.notifyUrl
  };
  const checksum = generateChecksum(params);

  if (checksum !== data.checksum) {
    console.error('Invalid checksum in notify');
    return res.status(400).send('Invalid checksum');
  }

  // Mark order as paid in your database here
  console.log(`Order ${data.transactionReference} confirmed as paid`);

  res.status(200).send('OK');
});