import axios, { Axios } from 'axios';
import React, {useState, useEffect, Fragment} from 'react';
import { Container } from 'react-bootstrap';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CRUD  = () => {

    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [isActive, setIsActive] = useState(0);

    const [editId, setEditId] = useState(0);
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState(0);
    const [editIsActive, setEditIsActive] = useState(0);

    const handleShow = () => setShow(true);

    const handleClose = () => setShow(false);
    Modal.setAppElement('#root');

    useEffect(() => {
        getData();
    },[])

    const getData = () => {
        axios.get('https://localhost:7292/api/Employees')
        .then((result) => {
            setData(result.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7292/api/Employees/${id}`)
        .then((result)=>{
            setEditId(result.data.id);
            setEditName(result.data.name);
            setEditAge(result.data.age);
            setEditIsActive(result.data.isActive);
        })
        .catch((error)=> {
            toast.error(error);
        })
    }

    const handleDelete = (id) => {
        if(window.confirm("Are you sure that you want to delete?") == true)
            axios.delete(`https://localhost:7292/api/Employees/${id}`)
            .then((result)=>{
                if(result.status === 200) {
                    toast.success('Employee has been deleted!');
                    getData();
                }
            })
            .catch((error)=> {
                toast.error(error);
            })
    }

    const handleUpdate = () => {
        const url = `https://localhost:7292/api/Employees/${editId}`;
        const data = {
            "id": editId,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }

        axios.put(url, data)
        .then((result) => {
            handleClose();
            getData();
            clear();
            toast.success('Employee has been updated!');
        })
        .catch((error)=> {
            toast.error(error);
        })
    }

    const handleSave = () => {
        const url = 'https://localhost:7292/api/Employees';
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }

        axios.post(url, data)
        .then((result) => {
            getData();
            clear();
            toast.success('Employee has been added!');
        })
        .catch((error)=> {
            toast.error(error);
        })
    }

    const clear = () => {
        setName('');
        setAge(0);
        setIsActive(0);
        setEditName('');
        setEditAge(0);
        setEditIsActive(0);
        setEditId(0);
    }
    
    const handleActiveChange = (e) => {
        if(e.target.checked)
            setIsActive(1);
        else 
            setIsActive(0);
    }

    const handleEditActiveChange = (e) => {
        if(e.target.checked)
            setEditIsActive(1);
        else 
            setEditIsActive(0);
    }

    return (
        <Fragment>
            <Container>
            <ToastContainer/>
                <div className='header'>
                    <div className='input-label'>
                        <label>Name:</label>
                        <input type="text" id="name" name="name" 
                            placeholder="Enter Name" value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                    <div className='input-label'>
                        <label>Age:</label>
                        <input type="text" id="age" name="age" 
                            placeholder="Enter Age" value={age}
                            onChange={(e)=>setAge(e.target.value)}
                        />
                    </div>
                    <div className='input-label'>
                        <label>IsActive:</label>
                        <input type="checkbox" id="isActive" 
                            name="isActive" checked={isActive === 1 ? true : false}
                            onChange={(e)=>handleActiveChange(e)} value={isActive}
                        />
                    </div>
                    <button id='modal-save' onClick={(e) => handleSave(e)}>Submit</button>
                </div>
            </Container>
            <table className='employee'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>IsActive</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index+ 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.age}</td>
                                        <td>{item.isActive}</td>
                                        <td colSpan={2}>
                                            <button id='edit'
                                                onClick={() => handleEdit(item.id)}
                                            >Edit</button> &nbsp;
                                            <button id='delete'
                                                onClick={() => handleDelete(item.id)}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                )
                            }) : "Loading..."
                    }
                </tbody>
            </table>
            <div>
                <Modal
                    isOpen={show}
                    onRequestClose={handleClose}
                    contentLabel="Modal de exemplo"
                >
                    <div className='modal-container'>
                    <label className='modal-label'>Modify / Update Employee</label>
                        <div className='modal-header'>
                            <div className='input-label'>
                                <label>Name:</label>
                                <input type="text" id="editName" name="editName" 
                                    placeholder="Enter Name" value={editName}
                                    onChange={(e)=>setEditName(e.target.value)}
                                />
                            </div>
                            <div className='input-label'>
                                <label>Age:</label>
                                <input type="text" id="editAge" name="editAge" 
                                    placeholder="Enter Age" value={editAge}
                                    onChange={(e)=>setEditAge(e.target.value)}
                                />
                            </div>
                            <div className='input-label'>
                                <label>IsActive:</label>
                                <input type="checkbox" id="editIsActive" 
                                    name="editIsActive" checked={editIsActive === 1 ? true : false}
                                    onChange={(e)=>handleEditActiveChange(e)} value={editIsActive}
                                />
                            </div>
                            <div className='modal-button'>
                                <button id='modal-close' onClick={handleClose}>Close</button>
                                <button id='modal-save' onClick={handleUpdate}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </Fragment>
    );
}

export default CRUD