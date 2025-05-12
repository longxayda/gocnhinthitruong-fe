import './Partners.css';

function PartnersSection() {
  const partners = [
    {
      link: 'https://power5technology.com',
      image: '/images/logo.png',
      alt: 'Đối tác Power 5 Technology',
    },
    {
      link: 'https://antoanhocduong.vn/',
      image: '/images/project1.jpg',
      alt: 'Dự án An toàn học đường',
    },
    {
      link: 'https://wisedu.io/vi',
      image: '/images/partner1.png',
      alt: 'Đối tác WisEdu',
    },
    {
      link: 'https://hrwis.io/',
      image: '/images/partner2.png',
      alt: 'Đối tác HrWis',
    },
    {
      link: 'https://alfacenscapital.com',
      image: '/images/afcs.jpg',
      alt: 'Đối tác Alfacens',
    },
  ];

  return (
    <section className="partners-section" data-aos="fade-up">
      <h2 className="partners-title" 
        style={{ 
          color: '#fff',
          textShadow: `
            -1px -1px 0 #333,
            1px -1px 0 #333,
            -1px 1px 0 #333,
            2px 2px 0 #333
          `
         }}
      >
        Các Dự Án và Đối Tác
      </h2>
      <div className="partners-logos">
        {partners.map((partner, index) => (
          <a
            key={index}
            href={partner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="partner-logo-wrapper"
          >
            <img
              src={partner.image}
              alt={partner.alt}
              className="partner-logo"
            />
          </a>
        ))}
      </div>
    </section>
  );
}

export default PartnersSection;
