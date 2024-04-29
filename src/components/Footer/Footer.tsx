import { FC, PropsWithChildren } from 'react'
import { Container } from '../Container/Container'
import { LanguageSelector } from '../LanguageSelector/LanguageSelector'
import styles from './Footer.module.scss'

export const Footer: FC<PropsWithChildren> = () => {
  return (
    <footer className={styles.footer}>
      <Container className={styles.wrapper}>
        <div className={styles.copyright}>
          Made with <span className={styles.heart}>❤</span> by{' '}
          <a href="https://t.me/techmeat" target="_blank" className={styles.author}>
            @techmeat
          </a>
        </div>
        <LanguageSelector />
      </Container>
    </footer>
  )
}
