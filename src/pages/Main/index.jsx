import React, { useState, useCallback, useEffect } from "react"
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeLeteButton } from "../../style"
import api from '../Services/api'


export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null)
  //Buscar

  useEffect(()=>{
    const repoStorage =localStorage.getItem('repos');
    if(repoStorage){
      setRepositorios(JSON.parse(repoStorage))
    }
  },[])

  //fazer alterações
  useEffect(()=>{
    localStorage.setItem('repos', JSON.stringify(repositorios));
  },[repositorios])

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit() {
      setLoading(true);

      setAlert(null)
      //para não chamar req sem conter nada no input
      try {
          if(newRepo === ''){ 
            throw new Error('Você precisa indicar um repositorio!')
          }
          //req HTTPS method .get
        const response = await api.get(`repos/${newRepo}`);
          // funcionalidade para não repetir nenhuma request
          const hasRepo = repositorios.find(repo => repo.name === newRepo);
          if(hasRepo){
            throw new Error("Repositorio Duplicado")
          }

        const data = {
          name: response.data.full_name,
        }
        setRepositorios([...repositorios, data]);
        setNewRepo('');
      } catch (error) {
        setAlert(true)
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
    submit();
  }, [newRepo, repositorios])




  function handleinputChange(e) {
    setNewRepo(e.target.value)
    setAlert(null)
  }

  const handleDelete = useCallback((repo) => {
    const find = repositorios.filter(r => r.name !== repo);
    setRepositorios(find);
  }, [repositorios])

  return (
    <div>
      <Container>
        <h1>
          <FaGithub size={25} />
          Meus Repositorios
        </h1>
        <Form onSubmit={handleSubmit} error={alert}>
          <input onSubmit={() => { }}
            type="text"
            placeholder="Adicionar Repositorio"
            value={newRepo}
            onChange={handleinputChange}
          />
          <SubmitButton Loading={loading ? 1 : 0}>
            {
              loading ? (
                <FaSpinner color="#fff" size={14} />
              ) : (
                <FaPlus color="#fff" size={14} />
              )}
          </SubmitButton>
        </Form>
        <List>

          {repositorios.map(repo => (
            <li key={repo.name}>
              <span>
                <DeLeteButton onClick={() => handleDelete(repo.name)}>
                  <FaTrash />
                </DeLeteButton>
              </span>
              <span>{repo.name}</span>
              <a href="">
                <FaBars size={20} />
              </a>
            </li>
          ))}
        </List>
      </Container>
    </div>
  )
}