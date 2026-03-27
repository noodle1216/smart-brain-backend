const handleRegister = (req, res, db, bcrypt) => {
	const { email, password, name } = req.body;
	
	if (!email || !password || !name) {
		return res.status(400).json('incorrect form submission');
	}

	const hash = bcrypt.hashSync(password);

//ZTM tutorial using commit and rollback
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0].email,
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(err => {
				trx.rollback();
				throw err;
			})
		})
		.catch(err => res.status(400).json('unable to register'))
}

//Use async/await recommended by ChatGPT
// const handleRegister = async (req, res, db, bcrypt) => {
//   const { email, password, name } = req.body;

//   if (!email || !password || !name) {
//     return res.status(400).json('incorrect form submission');
//   }

//   const hash = bcrypt.hashSync(password);

//   try {
//     await db.transaction(async trx => {
//       const loginEmail = await trx('login')
//         .insert({ hash, email })
//         .returning('email');

//       const user = await trx('users')
//         .insert({
//           email: loginEmail[0].email,
//           name,
//           joined: new Date()
//         })
//         .returning('*');

//       res.json(user[0]);
//     });
//   } catch (err) {
//     res.status(400).json('unable to register');
//   }
// };

module.exports = {
	handleRegister: handleRegister
};