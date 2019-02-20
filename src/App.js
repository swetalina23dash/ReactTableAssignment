import React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import Modal from 'react-responsive-modal';
import axios from "axios";


class App extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    
    employees: [],
    message:'',
    open:false,
    name: '',
    code: '',
    profession: '',
    color: '',
    city: '',
    branch: '',
    assigned: ''
  }
  this.upDateEmployee = this.upDateEmployee.bind(this);
  this.deleteEmployee = this.deleteEmployee.bind(this);
  this.addEmployee = this.addEmployee.bind(this);
  this.renderEditable = this.renderEditable.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.handleChangeCode = this.handleChangeCode.bind(this);
  this.handleChangeColor = this.handleChangeColor.bind(this);
  this.handleChangeProf = this.handleChangeProf.bind(this);
  this.handleChangeCity = this.handleChangeCity.bind(this);
  this.handleChangeBranch = this.handleChangeBranch.bind(this);
  this.handleChangeAssigned = this.handleChangeAssigned.bind(this);
}

handleChange(event) {
  this.setState({name: event.target.value});
}

handleChangeCode(event) {
  this.setState({code: event.target.value});
}

handleChangeColor(event) {
  this.setState({color: event.target.value});
}

handleChangeProf(event) {
  this.setState({profession: event.target.value});
}

handleChangeCity(event) {
  this.setState({city: event.target.value});
}

handleChangeBranch(event) {
  this.setState({branch: event.target.value});
}

handleChangeAssigned(event) {
  this.setState({assigned: event.target.value});
}

onOpenModal = () => {
  this.setState({ open: true });
};

onCloseModal = () => {
  this.setState({ open: false });
};

handleInputChange = (cellInfo, event) => {
    let data = [...this.state.employees];
  data[cellInfo.index][cellInfo.column.id] = event.target.value;

  this.setState({ employees:data });
};

renderEditable = cellInfo => {
  const cellValue = this.state.employees[cellInfo.index][cellInfo.column.id];

  return (
    <input
      placeholder="type here"
      name="input"
      type="text"
      onChange={this.handleInputChange.bind(null, cellInfo)}
      value={cellValue}
    />
  );
};

  componentWillMount = () => {
      axios.get('http://localhost:8080/api/employees')
      .then(response => {
        this.setState({ employees : response.data.data});
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  upDateEmployee(rowArr){
    const obj = {
       "id":rowArr.original.id,
       "name": rowArr.original.name,
       "code": rowArr.original.code,
       "profession": rowArr.original.profession,
       "color": rowArr.original.color,
       "city": rowArr.original.city,
       "branch": rowArr.original.branch,
       "assigned": rowArr.original.assigned
     };
    axios.post('http://localhost:8080/api/updateEmployees', obj)
        .then(res => console.log(res.data.message))
        .catch(err => console.log(err))
  }

  deleteEmployee(rowArr){
    
    axios.get('http://localhost:8080/api/deleteEmployees/'+rowArr.original.id)
    .then(res => {
      let employees = this.state.employees;
      employees.forEach(function(result, index) {
        if(result['id'] === rowArr.original.id) {
          employees.splice(index, 1);
        }    
      });
    this.setState({employees: employees});
    }).catch(err => console.log(err))
  }

  addEmployee(arr){
    
    var employees = this.state.employees
    
    const obj = {   
      "name": this.state.name,
      "code": this.state.code,
      "profession": this.state.profession,
      "color": this.state.color,
      "city": this.state.city,
      "branch": this.state.branch,
      "assigned": this.state.assigned
    };
    axios.post('http://localhost:8080/api/addEmployees', obj)
        .then(res => {
          
          employees.push({
          "id":res.data.id,
          "name": this.state.name,
          "code": this.state.code,
          "profession": this.state.profession,
          "color": this.state.color,
          "city": this.state.city,
          "branch": this.state.branch,
          "assigned": this.state.assigned
        });
        this.setState({employees: employees});
      }).catch(err => console.log(err))
  }

  

  render() {
    const {
      employees
    } = this.state;
   
    const { open } = this.state;
   
   
    const columns = [{
      Header: 'Name',
      accessor: 'name',
      Cell: this.renderEditable 
    }, {
      Header: 'Code',
      accessor: 'code',
      Cell: this.renderEditable
    },{
      Header: 'Profession',
      accessor: 'profession',
      Cell: this.renderEditable
    }, {
      Header: 'Color',
      accessor: 'color',
      Cell: this.renderEditable
    },{
      Header: 'City',
      accessor: 'city',
      Cell: this.renderEditable
    },{
      Header: 'Branch',
      accessor: 'branch',
      Cell: this.renderEditable
    },{
      Header: 'Assigned',
      accessor: 'assigned',
      Cell: this.renderEditable
    },{
      Header: 'Action',
      id: "id",
      Cell: row => (
        <div>
            <button onClick={() => this.upDateEmployee(row)}>Edit</button>
            <button onClick={() => this.deleteEmployee(row)}>Delete</button>
        </div>
    )
    }]
   

    return (
      <div className="App">
        {this.state.message}
        <h1>Plexxis Employees</h1>
        <ReactTable
            data={employees}
            columns={columns} defaultPageSize={5} className="-striped -highlight"
          /> 
          <button id="addBtn" onClick={this.onOpenModal}>Add New Row</button>
         <Modal open={open} onClose={this.onCloseModal} center>
          <h3>Add New Employee</h3>
          <form onSubmit={this.addEmployee}>
          <label>
            Name:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" value={this.state.name} onChange={this.handleChange} />
          </label><br/><br/>
          <label>
          Code:
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" value={this.state.code} onChange={this.handleChangeCode} />
          </label><br/><br/>
          <label>
          Profession:
          &nbsp;&nbsp;&nbsp; <input type="text" value={this.state.profession} onChange={this.handleChangeProf} />
          </label><br/><br/>
          <label>
          Color:
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" value={this.state.color} onChange={this.handleChangeColor} />
          </label><br/><br/>
          <label>
          City:
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" value={this.state.city} onChange={this.handleChangeCity} />
          </label><br/><br/>
          <label>
          Branch:
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" value={this.state.branch} onChange={this.handleChangeBranch} />
          </label><br/><br/>
          <label>
          Assigned:
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" value={this.state.assigned} onChange={this.handleChangeAssigned} />
          </label><br/><br/><br/>
          <input type="submit" value="Submit" />
        </form>
         
        </Modal>
      </div>
    );
      
  }
  
}

export default App;
