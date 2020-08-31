export default (mongoose) => {
  const schema = mongoose.Schema({
    agencia: {
      type: Number,
      required: true,
    },
    conta: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
    },
  });

  //terceiro parametro para manter no singular o nome do documento
  const accounts = mongoose.model('accounts', schema, 'accounts');


  return accounts;
};
