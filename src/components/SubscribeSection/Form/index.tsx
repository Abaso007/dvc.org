import { nanoid } from 'nanoid'
import { useCallback, useRef } from 'react'

import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'

import * as styles from './styles.module.css'

const Form: React.FC = () => {
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const honeypotNameRef = useRef(nanoid())
  const sendGAEvent = useCallback((e: React.FormEvent) => {
    if (hiddenInputRef.current?.value) {
      // It's a bot.
      return e.preventDefault()
    }

    logEvent('Subscribe Form')
  }, [])
  return (
    <form
      className={styles.form}
      action="https://dvc.us10.list-manage.com/subscribe/post?u=a08bf93caae4063c4e6a351f6&amp;id=24c0ecc49a"
      method="post"
      id="mc-embedded-subscribe-form"
      name="mc-embedded-subscribe-form"
      target="_blank"
      onSubmit={sendGAEvent}
    >
      <input
        className={styles.input}
        type="email"
        name="EMAIL"
        id="mce-EMAIL"
        placeholder="email address"
        required={true}
        aria-label="Enter your email"
      />

      <div hidden>
        <input type="hidden" name="tags" value="6537593" />
      </div>

      {/*real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input
          type="text"
          name={honeypotNameRef.current}
          ref={hiddenInputRef}
          tabIndex={-1}
        />
      </div>

      <button
        className={`${styles.button} btn-with-focus`}
        type="submit"
        name="subscribe"
        id="mc-embedded-subscribe"
      >
        Subscribe
      </button>
    </form>
  )
}

export default Form
