import { sectionIcon } from './icons.mjs';
import { action } from './components.mjs';
export const databaseSection = /* HTML */ `<section
  class="section database-section"
  id="bases-de-donnees"
  aria-labelledby="database-title"
>
  <div class="section-heading">
    <span class="eyebrow section-marker"
      >${sectionIcon('bases-de-donnees')}<span>04 / BASES DE DONNÉES</span></span
    >
    <h2 id="database-title">Vos données, au cœur<br />de votre application.</h2>
    <p>
      Une application métier repose aussi sur la qualité de ses données. Nous maîtrisons HFSQL et de
      nombreux systèmes de gestion de bases de données relationnelles (SGBDR), pour construire votre
      projet ou faire évoluer son architecture.
    </p>
  </div>
  <div class="database-grid">
    <article class="database-preferred">
      <span class="eyebrow">NOTRE MOTEUR DE PRÉDILECTION</span>
      <h3>PostgreSQL<span aria-hidden="true">↗</span></h3>
      <p>
        Nous privilégions PostgreSQL pour ses performances, la richesse de ses fonctionnalités
        intégrées et son modèle open source, sans coût de licence.
      </p>
      <ul class="database-benefits">
        <li>
          <strong>Des performances adaptées à vos usages</strong
          ><span
            >Un modèle de données, des index et des requêtes pensés pour les traitements de votre
            application.</span
          >
        </li>
        <li>
          <strong>Des fonctionnalités intégrées</strong
          ><span
            >Transactions, contraintes d’intégrité et prise en charge de données JSON : des outils
            pour répondre à des besoins métier variés.</span
          >
        </li>
        <li>
          <strong>Sans coût de licence du moteur</strong
          ><span
            >La licence PostgreSQL autorise l’utilisation sans redevance, y compris en entreprise.
            L’hébergement, la maintenance et l’exploitation restent à prévoir.</span
          >
        </li>
      </ul>
      <a class="text-link" href="https://www.postgresql.org/about/licence/"
        >Consulter la licence PostgreSQL ↗</a
      >
    </article>
    <div class="database-engines">
      <span class="eyebrow">UNE EXPERTISE MULTIMOTEUR</span>
      <h3>Le bon moteur<br />pour votre contexte.</h3>
      <dl>
        <div>
          <dt>HFSQL</dt>
          <dd>
            La base de données propriétaire de PC SOFT, que nous maîtrisons dans le cadre de vos
            applications et de leur évolution.
          </dd>
        </div>
        <div>
          <dt>SQL Server · Oracle · MySQL</dt>
          <dd>
            Des moteurs que nous maîtrisons également, pour développer autour de votre environnement
            et de vos contraintes.
          </dd>
        </div>
        <div>
          <dt>Et d’autres SGBDR</dt>
          <dd>
            Notre expertise ne se limite pas à cette liste. Le choix tient compte de votre existant,
            de vos usages et des conditions d’exploitation.
          </dd>
        </div>
      </dl>
    </div>
  </div>
  <div class="database-project">
    <div>
      <h3>Faire évoluer le moteur.<br />Préserver la valeur des données.</h3>
      <p>
        Conception du modèle, optimisation des accès ou migration : nous relions les choix de base
        de données aux besoins de votre application. Une reprise implique de préparer les
        correspondances, de contrôler la cohérence des données et de valider les traitements métier.
      </p>
    </div>
    ${action('Parlons de vos données')}
  </div>
</section>`;
