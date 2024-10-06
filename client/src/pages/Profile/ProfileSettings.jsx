import React, { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

import './Profile.css';

const ProfileSettings = () => {
  const { profile, address, employmentHistory, educationHistory } = useOutletContext();

  // const profileImage = profile?.profile_picture
  //   ? `/path/to/images/${profile.profile_picture}` // Adjust path to actual image directory if needed
  //   : "https://via.placeholder.com/100";

  const profileImage = "https://via.placeholder.com/100";

  // Create local state for employment and education history to handle editing
  const [editableEmploymentHistory, setEditableEmploymentHistory] = useState([...employmentHistory]);
  const [editableEducationHistory, setEditableEducationHistory] = useState([...educationHistory]);

  // State to keep track of which rows are currently being edited
  const [editingEmploymentId, setEditingEmploymentId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);


  // Handle changes for employment history fields
  const handleEmploymentChange = (id, field, value) => {
    const updatedHistory = editableEmploymentHistory.map((job) =>
      job.employment_id === id ? { ...job, [field]: value } : job
    );
    setEditableEmploymentHistory(updatedHistory);
  };

  // Handle changes for education history fields
  const handleEducationChange = (id, field, value) => {
    const updatedEducation = editableEducationHistory.map((edu) =>
      edu.education_id === id ? { ...edu, [field]: value } : edu
    );
    setEditableEducationHistory(updatedEducation);
  };

  // Handle saving changes for employment history
  const saveEmploymentChanges = (id) => {
    setEditingEmploymentId(null);
    // console.log("Saved employment data:", editableEmploymentHistory);
    const updatedEmployment = editableEmploymentHistory.find((job) => job.employment_id === id);
    axios
      .put(`/api/update-employment-history/${id}`, updatedEmployment, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Employment history updated successfully:', response.data.data);
          setEditingEmploymentId(null); // Exit editing mode
        }
      })
      .catch((error) => {
        console.error('Error updating employment history:', error);
      });

  };

  // Handle saving changes for education history
  const saveEducationChanges = (id) => {
    setEditingEducationId(null); // Exit editing mode
    // console.log("Saved education data:", editableEducationHistory);

    const updatedEducation = editableEducationHistory.find((edu) => edu.education_id === id);

    axios
      .put(`http://localhost:8000/api/update-education-history/${id}`, updatedEducation, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Education history updated successfully:', response.data.data);
          setEditingEducationId(null); // Exit editing mode
        }
      })
      .catch((error) => {
        console.error('Error updating education history:', error);
      });

  };

  // Add new employment row in edit mode
  const addNewEmployment = () => {
    const newEmployment = {
      employment_id: `temp-${Date.now()}`, // Temporary ID for new row
      job_title: '',
      company: '',
      start_date: '',
      end_date: '',
      description: '',
    };
    setEditableEmploymentHistory([...editableEmploymentHistory, newEmployment]);
    setEditingEmploymentId(newEmployment.employment_id);
  };

  // Add new education row in edit mode
  const addNewEducation = () => {
    const newEducation = {
      education_id: `temp-${Date.now()}`, // Temporary ID for new row
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
    };
    setEditableEducationHistory([...editableEducationHistory, newEducation]);
    setEditingEducationId(newEducation.education_id);
  };

  // Save new employment entry to server
  const saveNewEmployment = (employment) => {
    axios
      .post(`/api/add-employment-history`, employment, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('New employment added successfully:', response.data.data);
          // Replace temporary ID with the actual ID from the response
          setEditableEmploymentHistory((prev) =>
            prev.map((job) =>
              job.employment_id === employment.employment_id ? response.data.data : job
            )
          );
          setEditingEmploymentId(null);
        }
      })
      .catch((error) => {
        console.error('Error adding new employment:', error);
      });
  };

  // Save new education entry to server
  const saveNewEducation = (education) => {
    axios
      .post(`/api/add-education-history`, education, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('New education added successfully:', response.data.data);
          // Replace temporary ID with the actual ID from the response
          setEditableEducationHistory((prev) =>
            prev.map((edu) => (edu.education_id === education.education_id ? response.data.data : edu))
          );
          setEditingEducationId(null);
        }
      })
      .catch((error) => {
        console.error('Error adding new education:', error);
      });
  };

  return (
    <>
      <div className="card mb-4 profile-section">
        <h3 className="card-title">General Info</h3>
        <div className="row gap-3 align-items-center">

          {/* Profile Picture */}
          <div className="d-flex align-items-center profile-picture-settings">

            <div className="profile-image-container">
              <img src={profileImage} alt="Profile" className="profile-image rounded-circle" />
            </div>

            <div className='d-flex flex-column ms-2'>
              <label className="form-label">Profile Picture</label>
              <p className="">{profile?.profile_picture + " under 10MB" || "No Image Provided"}</p>
            </div>

            <div className="d-flex ms-auto ps-auto gap-1 justify-content-start align-items-center btn-profile-button">
              <button className="btn btn-outline-secondary btn-sm">Upload New Picture</button>
              <button className="btn btn-outline-danger btn-sm ms-2">Delete Picture</button>
            </div>

          </div>

          {/* Profile Details Settings */}
          <div className="col-12 col-md-10 w-100">
            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" placeholder={profile?.first_name || ''} readOnly />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" placeholder={profile?.last_name || ''} readOnly />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={profile?.email || ''} readOnly />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" placeholder={profile?.phone || 'None Provided'} readOnly />
              </div>
            </div>

            {/* Centering the button and adding responsive width */}
            <div className="d-flex">
              <button className="btn btn-primary">Save New Changes</button>
            </div>
          </div>

        </div>
      </div>

      {/* Personal Information & Contact Details Section */}
      <div className="card mb-4 profile-section">

        <h3 className="card-title">Personal Information & Contact Details</h3>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-control" value={profile?.date_of_birth || ''} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" placeholder={`${address['city']}, ${address['state']}`} readOnly />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">LinkedIn Profile</label>
            <input type="text" className="form-control" placeholder={profile.linkedin_profile || 'Not Provided'} />
          </div>
        </div>

        <div>
          <button className="btn btn-primary">Save New Changes</button>
        </div>

      </div>

      {/* Career & Education History Section */}
      <div className="card mb-4 profile-section">
        <h3 className="card-title">Career & Education History</h3>
        {/* Employment History */}
        <h5>Employment History</h5>
        <div className='table-responsive'>


          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Job Title</th>
                <th scope="col">Company</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {editableEmploymentHistory.length > 0 ? (
                editableEmploymentHistory.map((job) => (
                  <tr key={job.employment_id}>
                    <td>
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={job.job_title || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'job_title', e.target.value)}
                        />
                      ) : (
                        job.job_title
                      )}
                    </td>
                    <td>
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={job.company || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'company', e.target.value)}
                        />
                      ) : (
                        job.company
                      )}
                    </td>
                    <td>
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="date"
                          className="form-control"
                          value={job.start_date || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'start_date', e.target.value)}
                        />
                      ) : (
                        new Date(job.start_date).toLocaleDateString()
                      )}
                    </td>
                    <td>
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="date"
                          className="form-control"
                          value={job.end_date || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'end_date', e.target.value)}
                        />
                      ) : (
                        job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Present'
                      )}
                    </td>
                    <td>
                      {editingEmploymentId === job.employment_id ? (
                        <div className="btn-group" role='edit-employment'>
                          <button className="btn btn-success btn-sm btn-save" onClick={() =>
                            typeof job.employment_id === 'string' && job.employment_id.includes('temp')
                              ? saveNewEmployment(job)
                              : saveEmploymentChanges(job.employment_id)
                          }>
                            <i className="fa-regular fa-floppy-disk"></i>
                          </button>
                          <button className="btn btn-sm btn-danger btn-delete">
                            <i className="fa-regular fa-trash-can btn-delete"></i>
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-warning btn-light btn-sm" onClick={() => setEditingEmploymentId(job.employment_id)}>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No employment history available.</td>
                </tr>
              )}
              {/* Add New Employment Button */}
              <tr>
                <td colSpan="5">
                  <button className="btn btn-outline-primary btn-sm rounded-circle" onClick={addNewEmployment}>
                    <i className='fa-solid fa-plus'></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Education History */}
        <h5>Education History</h5>
        <div className='table-responsive'>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Degree</th>
                <th scope="col">Field of Study</th>
                <th scope="col">Institution</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {editableEducationHistory.length > 0 ? (
                editableEducationHistory.map((edu) => (
                  <tr key={edu.education_id}>
                    <td>
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={edu.degree || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'degree', e.target.value)}
                        />
                      ) : (
                        edu.degree
                      )}
                    </td>
                    <td>
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={edu.field_of_study || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'field_of_study', e.target.value)}
                        />
                      ) : (
                        edu.field_of_study
                      )}
                    </td>
                    <td>
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={edu.institution || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'institution', e.target.value)}
                        />
                      ) : (
                        edu.institution
                      )}
                    </td>
                    <td>
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="date"
                          className="form-control"
                          value={edu.start_date || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'start_date', e.target.value)}
                        />
                      ) : (
                        new Date(edu.start_date).toLocaleDateString()
                      )}
                    </td>
                    <td>
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="date"
                          className="form-control"
                          value={edu.end_date || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'end_date', e.target.value)}
                        />
                      ) : (
                        edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'Present'
                      )}
                    </td>
                    <td>
                      {editingEducationId === edu.education_id ? (
                        <div className='btn-group' role='edit-education'>
                          <button className="btn btn-success btn-sm btn-save" onClick={() =>
                            typeof edu.education_id === 'string' && edu.education_id.includes('temp')
                              ? saveNewEducation(edu)
                              : saveEducationChanges(edu.education_id)
                          }>
                            <i className="fa-regular fa-floppy-disk"></i>
                          </button>
                          <button className="btn btn-sm btn-danger mx-1">
                            <i className="fa-regular fa-trash-can btn-delete"></i>
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-warning btn-light btn-sm" onClick={() => setEditingEducationId(edu.education_id)}>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No education history available.</td>
                </tr>
              )}
              {/* Add New Education Button */}
              <tr>
                <td colSpan="6">
                  <button className="btn btn-outline-primary btn-sm" onClick={addNewEducation}>
                    <i className='fa-solid fa-plus'></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ProfileSettings;