const db = require("../../config/db");



module.exports = {
    all(callback) {
        db.query(`SELECT * FROM instructors ORDER BY id`, function(err, results) {
            if(err) throw `Database Error! ${ err }`;

            callback(results.rows);
        });
    },

    create(values, callback) {
        const query = `
            INSERT INTO instructors(
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${ err }`;
            
            callback(results.rows[0]);
        });
    },

    find(id, callback) {
        db.query(`SELECT * FROM instructors WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${ err }`;

            callback(results.rows[0]);
        });
    },

    update(values, callback) {
        const query = `
            UPDATE instructors SET
                avatar_url = ($1),
                name       = ($2),
                birth      = ($3),
                gender     = ($4),
                services   = ($5)
            WHERE id = $6
        `;

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${ err }`;

            callback();
        });
    },

    delete(id, callback) {
        db.query(`DELETE FROM instructors WHERE id = $1`, [ id ], function(err, results) {
            if(err) throw `Database Error! ${ err }`;

            return callback();
        });
    }
}