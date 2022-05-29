import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'
import signInFirst from './assets/sign_in_first.gif'
import goodJob from './assets/goodjob.png'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
  const [account_name, set_account_name] = React.useState()

  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  const [showNotification, setShowNotification] = React.useState(false)
  React.useEffect(
    () => {
      if (window.walletConnection.isSignedIn()) {

        window.contract.get_account_name({ account_id: window.accountId })
          .then(name => {
            set_account_name(name)
          })
      }
    },
    []
  )

  return (
    <>
      {window.walletConnection.isSignedIn() ? (
        <button className="link" style={{ float: 'right' }} onClick={logout}>
          Sign out
        </button>
      ) : (
        <button className="link" style={{ float: 'right' }} onClick={login}>
          Sign in
        </button>
      )}
      <main>
        <p style={{textAlign: 'center'}}>
          {!account_name ? 
            <img src={signInFirst} width={300} height={300} />
            :
            <img src={goodJob} width={300} height={300} />
          }
        </p>
        <h1>
          <label
            htmlFor="account_name"
            style={{
              color: 'var(--secondary)',
              borderBottom: '2px solid var(--secondary)'
            }}
          >
            {account_name ? `Hello, ${account_name}!` : `Please enter  your name!`}
          </label>
        </h1>
        <p style={{textAlign: 'center'}}>
          {!window.walletConnection.isSignedIn() && `(you have to login first!)`}
        </p>
        <form onSubmit={async event => {
          event.preventDefault()
          const { fieldset, account_name } = event.target.elements
          const name = account_name.value
          fieldset.disabled = true
          try {
            await window.contract.set_account_name({
              message: name
            })
          } catch (e) {
            alert(
              'Something went wrong! ' +
              'Maybe you need to sign out and back in? ' +
              'Check your browser console for more info.'
            )
            throw e
          } finally {
            fieldset.disabled = false
          }
          set_account_name(name)
          setShowNotification(true)
        }}>
          <fieldset id="fieldset">
            <div style={{ display: 'flex' }}>
              <input
                autoComplete="off"
                defaultValue={account_name}
                id="account_name"
                onChange={e => setButtonDisabled(e.target.value === account_name)}
                style={{ flex: 1 }}
              />
              <button
                disabled={buttonDisabled || !window.walletConnection.isSignedIn()}
                style={{ borderRadius: '0 5px 5px 0' }}
              >
                Save
              </button>
            </div>
          </fieldset>
        </form>
      </main>
    </>
  )
}

