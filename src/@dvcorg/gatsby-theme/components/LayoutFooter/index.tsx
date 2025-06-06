import cn from 'classnames'

import { blogsPageLink } from '@/constants/internalLinks'
import * as styles from '@dvcorg/gatsby-theme/src/components/LayoutFooter/styles.module.css'
import LayoutWidthContainer from '@dvcorg/gatsby-theme/src/components/LayoutWidthContainer'
import Link from '@dvcorg/gatsby-theme/src/components/Link'
import SocialIcon, {
  ISocialIcon
} from '@dvcorg/gatsby-theme/src/components/SocialIcon'
import { ReactComponent as DiscordSVG } from '@dvcorg/gatsby-theme/src/components/SocialIcon/discord.svg'
import { ReactComponent as GithubSVG } from '@dvcorg/gatsby-theme/src/components/SocialIcon/github.svg'
import { ReactComponent as TwitterSVG } from '@dvcorg/gatsby-theme/src/components/SocialIcon/twitter.svg'
import { getFirstPage } from '@dvcorg/gatsby-theme/src/utils/shared/sidebar'

import { ReactComponent as LogoSVG } from '../../../../../static/img/dvc_icon-color--square_vector.svg'

const docsPage = getFirstPage()

interface IFooterLinkData {
  href: string
  text: string
  icon?: JSX.Element
  target?: '_blank'
}

interface IFooterListData {
  header: string
  links: Array<IFooterLinkData>
}

const footerListsData: Array<IFooterListData> = [
  {
    header: 'Product',
    links: [
      {
        href: '/',
        text: 'Overview'
      },
      {
        href: '/doc/use-cases',
        text: 'Use Cases'
      },
      {
        href: blogsPageLink,
        text: 'Blog'
      }
    ]
  },
  {
    header: 'Help',
    links: [
      { href: '/support', text: 'Support' },
      { href: '/doc/start', text: 'Get started' },
      { href: '/community', text: 'Community' },
      { href: docsPage, text: 'Documentation' }
    ]
  },
  {
    header: 'Community',
    links: [
      {
        href: 'https://twitter.com/DVCorg',
        text: 'Twitter',
        icon: <TwitterSVG className={styles.icon} />,
        target: '_blank'
      },
      {
        href: 'https://github.com/iterative/dvc',
        text: 'Github',
        icon: <GithubSVG className={styles.icon} />,
        target: '_blank'
      },
      {
        href: '/chat',
        text: 'Discord',
        icon: <DiscordSVG className={styles.icon} />
      }
    ]
  }
]

const footerSocialIconsData: Array<ISocialIcon> = [
  {
    site: 'github',
    label: 'DVC Github Page',
    url: 'https://github.com/iterative/dvc'
  },
  {
    site: 'twitter',
    label: 'DVC Twitter',
    url: 'https://twitter.com/DVCorg'
  },
  {
    site: 'youtube',
    label: 'DVC.org Youtube Channel',
    url: 'https://www.youtube.com/channel/UC37rp97Go-xIX3aNFVHhXfQ'
  },
  {
    site: 'discord',
    label: 'DVC Discord chat',
    url: 'https://www.dvc.org/chat'
  }
]

const FooterLists: React.FC = () => (
  <div className={styles.columns}>
    {footerListsData.map(({ header, links }, index) => (
      <div className={styles.column} key={index}>
        <h2 className={styles.heading}>{header}</h2>
        <ul className={styles.links}>
          {links.map(({ text, target, href, icon }, i) => (
            <li
              // className={styles.linkItem}
              key={i}
            >
              <Link target={target} href={href} className={styles.link}>
                {icon}
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)

const FooterSocialIcons: React.FC = () => (
  <div className={styles.socialIcons}>
    {footerSocialIconsData.map(({ site, label, url }, index) => (
      <SocialIcon
        key={index}
        site={site}
        label={label}
        url={url}
        className={cn(styles.link, styles.socialIcon)}
      />
    ))}
  </div>
)

const LayoutFooter: React.FC = () => (
  <footer className={styles.wrapper}>
    <LayoutWidthContainer className={cn(styles.container)} wide>
      <div
      //  className={styles.top}
      >
        <Link className={styles.logo} href="/" title="dvc.org">
          <LogoSVG />
        </Link>
      </div>
      <FooterLists />

      <div className="mx-auto mt-6">
        <FooterSocialIcons />
      </div>
    </LayoutWidthContainer>
  </footer>
)

export default LayoutFooter
