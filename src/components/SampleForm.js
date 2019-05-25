import React from "react"
import axios from "axios"
import qs from "qs"
import { Formik, Field } from 'formik';
import ErrorMessage from './ErrorMessage';

function validate(values) {
  let errors = {}

  // name
  if (!values.name) {
    errors.name = '名前を入力してください';
  } else if(values.name.length > 100) {
    errors.name = '名前は100文字以内で入力してください';
  }
 
  // email
  if (!values.email) {
    errors.email = 'メールを入力してください';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'メールの形式が正しくありません';
  }

  // reason
  // novalidation

  // message
  if (values.message && values.message.length > 400) {
    errors.password = 'メッセージは400字以内で入力してください'
  }

  return errors
}



class SampleForm extends React.Component {
  render() {

    return (
      <Formik
        initialValues={{
          'form-name': 'contact',
          'bot-field': '',
          name: '',
          email: '',
          reason: '2',
          message: '',
          sampleFile: null,
        }}
        validate={validate}
        onSubmit={(values, actions) => {
          console.log(values.sampleFile);
          const  params = new FormData()
          params.append('form-name', values['form-name'])
          params.append('bot-field', values['bot-field'])
          params.append('name', values.name)
          params.append('email', values.email)
          params.append('reason', values.reason)
          params.append('message', values.message)
          params.append('sampleFile', values.sampleFile)

          const options = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: params,
            url: "/"
          };
          axios(options).then(res => {
            actions.resetForm();
            actions.setSubmitting(false);
            alert('問い合わせ内容を送信しました。')
          }).catch(err => {
            alert(err);
          })
        }}
        render={
          ({
            handleSubmit,
            dirty,
            isSubmitting,
            setFieldValue,
          }) => (
            <form
              name="contact"
              method="POST"
              novalidate="true"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              <Field type="hidden" name="bot-field" />
              <Field type="hidden" name="form-name" />
              <p>
                <label>
                  名前: 
                  <Field type="text" name="name"/>
                </label>
                <ErrorMessage name="name" />
              </p>
              <p>
                <label>
                  メール: 
                  <Field type="email" name="email"/>
                </label>
                <ErrorMessage name="email" />
              </p>
              <p>
                <label>
                  お問い合わせ内容: 
                  <Field component="select" name="reason">
                    <option value="1">質問1</option>
                    <option value="2">質問2</option>
                    <option value="3">質問3</option>
                    <option value="4">質問4</option>
                  </Field>
                </label>
              </p>
              <p>
                <label>
                  メッセージ:
                  <Field component="textarea" name="message" />
                </label>
                <ErrorMessage name="message" />
              </p>
              <p>
                <label>
                  ファイル: 
                  <input
                    id="sampleFile"
                    name="sampleFile"
                    type="file"
                    onChange={event => {
                      console.log(event.currentTarget.files[0])
                      setFieldValue("sampleFile", event.currentTarget.files[0])
                    }}
                  />
                </label>
              </p>
              <p>
                <button type="submit" disabled={!dirty && isSubmitting}>
                  送信
                </button>
              </p>
            </form>
          )
        }
      />
    );
  }
}

export default SampleForm;

