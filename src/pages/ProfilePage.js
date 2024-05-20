import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Modal,
} from "react-bootstrap";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth } from "../firebase/Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProfilePage = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalBeneficiary, setModalBeneficiary] = useState({
    index: null,
    name: "",
    email: "",
    walletAddress: "",
  });

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestore = getFirestore();
        const userId = user.uid;
        const userDoc = doc(firestore, `users/${userId}`);

        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNickname(data.nickname || "");
          setEmail(data.email || "");
          setWalletAddress(data.walletAddress || "");
          setBeneficiaries(data.beneficiaries || []);
        } else {
          await setDoc(userDoc, {
            email: user.email,
            nickname: "User Nickname",
          });
        }
      } else {
        console.log("User is not authenticated");
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const firestore = getFirestore();
      const userDoc = doc(firestore, "users", user.uid);
      await setDoc(userDoc, {
        nickname,
        email,
        walletAddress,
        beneficiaries,
      });
      alert("Profile updated successfully");
    }
  };

  const handleAddBeneficiary = () => {
    setModalBeneficiary({
      index: null,
      name: "",
      email: "",
      walletAddress: "",
    });
    setShowModal(true);
  };

  const handleEditBeneficiary = (index) => {
    setModalBeneficiary({ index, ...beneficiaries[index] });
    setShowModal(true);
  };

  const handleSaveBeneficiary = async () => {
    const updatedBeneficiaries = [...beneficiaries];
    if (modalBeneficiary.index !== null) {
      updatedBeneficiaries[modalBeneficiary.index] = {
        name: modalBeneficiary.name,
        email: modalBeneficiary.email,
        walletAddress: modalBeneficiary.walletAddress,
      };
    } else {
      updatedBeneficiaries.push({
        name: modalBeneficiary.name,
        email: modalBeneficiary.email,
        walletAddress: modalBeneficiary.walletAddress,
      });
    }
    setBeneficiaries(updatedBeneficiaries);
    setShowModal(false);
    await updateBeneficiariesInFirestore(updatedBeneficiaries);
  };

  const handleRemoveBeneficiary = async (index) => {
    const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
    setBeneficiaries(updatedBeneficiaries);
    await updateBeneficiariesInFirestore(updatedBeneficiaries);
  };

  const updateBeneficiariesInFirestore = async (updatedBeneficiaries) => {
    const user = auth.currentUser;
    if (user) {
      const firestore = getFirestore();
      const userDoc = doc(firestore, "users", user.uid);
      await updateDoc(userDoc, {
        beneficiaries: updatedBeneficiaries,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-3">Profile</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nickname</Form.Label>
                  <Form.Control
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Wallet Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Save
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-3">
                Beneficiaries
              </Card.Title>
              <ListGroup className="mb-4">
                {beneficiaries.map((beneficiary, index) => (
                  <ListGroup.Item key={index}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{beneficiary.name}</strong> -{" "}
                        {beneficiary.email} - {beneficiary.walletAddress}
                      </div>
                      <div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEditBeneficiary(index)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveBeneficiary(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                variant="primary"
                className="w-100"
                onClick={handleAddBeneficiary}
              >
                Add Beneficiary
              </Button>
            </Card.Body>
          </Card>

          {/* Modal for Adding/Editing Beneficiary */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                {modalBeneficiary.index !== null
                  ? "Edit Beneficiary"
                  : "Add Beneficiary"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalBeneficiary.name}
                    onChange={(e) =>
                      setModalBeneficiary({
                        ...modalBeneficiary,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={modalBeneficiary.email}
                    onChange={(e) =>
                      setModalBeneficiary({
                        ...modalBeneficiary,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Wallet Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalBeneficiary.walletAddress}
                    onChange={(e) =>
                      setModalBeneficiary({
                        ...modalBeneficiary,
                        walletAddress: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveBeneficiary}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
