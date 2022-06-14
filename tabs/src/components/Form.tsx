import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import AsyncSelect from 'react-select/async'
import './form.css'
import axios from 'axios'

interface ICompany {
  label: string
  value: string
  companyId: string 
}

interface IContact {
  label: string
  value: string
  contactId: string
  phoneNumber: string
}

const FormComponent = () => {
  const { handleSubmit, register, control, watch, setValue } = useForm()
  const [inputValue, setInputValue] = useState('')

  const isValid = watch('company') && watch('contact') && watch('password') && watch('phone')

  const handleChange = (value: ICompany | IContact | any, inputName: string) => {

    setValue(inputName, value)

    if(inputName === 'contact' && value?.phoneNumber) {
      setValue('phone', value?.phoneNumber)
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  const handleFetch = (url: string, inputName: string) => {

    return axios.get(url).then(({ data }) => {

      if(inputName === 'contact') {
        return data?.slice(0, 20).map(({ name, id, phoneNumber }: any) => ({ value: name, label: name, contactId: id, phoneNumber }))
      }

      return data?.slice(0, 20).map(({ name, id }: any) => ({ value: name, label: name, companyId: id }))
    }).catch((error) => console.error(error))
  }


  const handleSubmitForm = async ({ company, phoneNumber, password, contact }: any) => {
      // const res = await axios.post('https://2di.nl/mock/?action=submit', { companyId: company.companyId, contactId: contact.contactId, phoneNumber, password })
      await axios(`https://2di.nl/mock/?action=submit&companyId=${company.companyId}&contactId=${contact.contactId}&phoneNumber=${phoneNumber}&password=${password}`)
      
  }

  const generateRandomPassword = () => {
    let generatedPassword = ''
    const passwordLength = 8

    for(let i = 0; i <= passwordLength; i++) {
        generatedPassword += String.fromCharCode(Math.ceil((Math.random() * 100 + 50)))
    }

    setValue('password', generatedPassword)
    return generatedPassword
  }

  return (
    <div id='form-container'>
      <Form onSubmit={handleSubmit((values) => handleSubmitForm(values))} id='form'>
        <Form.Group className="mb-3">
          <Form.Label>Company name</Form.Label>
          <Controller
            name="company"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <AsyncSelect
                {...field}
                cacheOptions
                getOptionLabel={e => e.label}
                getOptionValue={e => e.value}
                onInputChange={handleInputChange}
                onChange={(e) => handleChange(e, 'company')}
                loadOptions={() => handleFetch(`https://2di.nl/mock/?action=companies&searchString=${inputValue}`, 'company')}
                placeholder='Company name'
              />
            )}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contact name</Form.Label>
          <Controller
            name="contact"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
               <AsyncSelect
                {...field}
                cacheOptions
                getOptionLabel={e => e.label}
                getOptionValue={e => e.value}
                onInputChange={handleInputChange}
                onChange={(e) => handleChange(e, 'contact')}
                loadOptions={() => handleFetch(`https://2di.nl/mock/?action=contacts&searchString=${inputValue}`, 'contact')}
                placeholder='Contact name'
                isDisabled={!watch('company')}
              />
            )}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control placeholder="Password" className="form-control" {...register('password', { required: true })} disabled={!watch('contact')} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type='button' disabled={!watch('contact')} onClick={generateRandomPassword}>Button</button>
        </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control placeholder="Phone" disabled readOnly {...register('phone')} />
        </Form.Group>

        <Button variant="primary" type='submit' disabled={!isValid}>Submit</Button>
      </Form>
    </div>
  )
}

export default FormComponent
