require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Conexión a MongoDB Atlas

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Conectado exitosamente a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err));

// Modelo para la colección &quot;empleados&quot;

const empleadoSchema = new mongoose.Schema({
    clave: Number, 
    nombre: String,  
    direccion: String, 
    fechaDeNacimiento: Date, 
    sexo: String, 
    tipoDeSangre: String
});
const Empleado = mongoose.model('Empleado', empleadoSchema, 'empleados');

// Endpoint GET: Obtener todos los empleados

app.get('/api/empleados', async (req, res) => {
try {
const empleados = await Empleado.find();
res.json(empleados);
} catch (error) {
res.status(500).json({ mensaje: error.message });
}
});

// Endpoint POST: Insertar empleado desde Postman

app.post('/api/empleados', async (req, res) => {
try {
const nuevoEmpleado = new Empleado(req.body);
const guardado = await nuevoEmpleado.save();
res.status(201).json(guardado);
} catch (error) {
res.status(400).json({ mensaje: error.message });
}
});

//Endpoint PUT: Modificar empleados desde Postman

app.put('/api/empleados/:clave', async (req, res) => {
    try {
        const empleado = await Empleado.findOneAndUpdate(
            {clave: req.params.clave},
            req.body,
            {new: true, runValidators: true}
        );
        if (!empleado) {
            return res.status(404).json({ mensaje : 'Empleado no encontrado'});
        }
        res.json(empleado);
    } catch (error) {
        res.status(400).json({ mensaje : error.message});
    }
});

//Endpoint DELETE: elimidar empleados desde Postman

app.delete('/api/empleados/:clave', async (req, res) => {
    try {
        const empleado = await Empleado.findOneAndDelete ({
            clave: req.params.clave
        });
        if (!empleado) {
            return res.status(404).json({ mensaje: 'Empleado no encontrado'});
        }
        res.json({ mensaje: 'Empleado eliminado exitosamente', empleado});
    } catch (error) {
        res.status(400).json({ mensaje: error.message});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en el puerto ${PORT}'));
