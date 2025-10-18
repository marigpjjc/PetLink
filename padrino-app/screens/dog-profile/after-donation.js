// Boton de pagar
payButton.addEventListener('click', async () => {
  // Validar campos
  if (!cardNumber.value || !cardName.value || !cardExpiry.value || !cardCVV.value) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  // Obtener el usuario actual (padrino)
  const padrinoId = localStorage.getItem('userId') || 1;
  
  // Crear la donacion con los campos correctos de la tabla
  const donationData = {
    id_padrino: parseInt(padrinoId),
    id_dog: parseInt(dogId),
    id_need: parseInt(needId),
    transaction_id: `TXN-${Date.now()}`,
    state: 'completada',
    price: parseFloat(currentNeed.price)
  };
  
  console.log('Datos de donacion a enviar:', donationData);
  
  const result = await createDonation(donationData);
  
  console.log('Resultado:', result);
  
  if (result) {
    // EXITO - ir a pantalla de donacion exitosa
    localStorage.removeItem('selectedNeedId');
    window.location.href = 'donation-success.html';
  } else {
    // ERROR - ir a pantalla de error
    localStorage.setItem('errorMessage', 'No se pudo procesar la donacion');
    localStorage.setItem('returnPage', 'after-donation.html');
    window.location.href = 'error.html';
  }
});