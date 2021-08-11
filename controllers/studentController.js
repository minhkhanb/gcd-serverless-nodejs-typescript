'use strict';

const firebase = require('../db');
const Student = require('../models/student');
const firestore = firebase.firestore();

const addStudent = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('students').doc().set(data);
        res.send('Record saved successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
}

const getAllStudents = async (req, res, next) => {
    try {
        const students = await firestore.collection('students');
        const data = await students.get();
        const studentsArray = [];
        if (data.empty) {
            res.status(404).send('No student record found');
        } else {
            data.forEach(doc => {
                const student = new Student(
                    doc.id,
                  doc.data().firstName,
                  doc.data().lastName,
                  doc.data().fatherName,
                  doc.data().classEnrolled,
                  doc.data().age,
                  doc.data().phoneNumber,
                  doc.data().subject,
                  doc.data().year,
                  doc.data().semester,
                  doc.data().status
                );

                studentsArray.push(student);
            });

            res.send(studentsArray);
        }
    } catch(err) {
        res.status(400).send(err.message);
    }
}

const getStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        const student = await firestore.collection('students').doc(id);
        const data = await student.get();
        if (!data.exists) {
            res.status(404).send('Student with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch(err) {
        res.status(400).send(err.message);
    }
}

const updateStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const student = await firestore.collection('students').doc(id);
        await student.update(data);
        res.send('Student record updated successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
}

const deleteStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('students').doc(id).delete();
        res.send('Record deleted successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = {
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent
}