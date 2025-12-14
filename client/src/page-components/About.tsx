
const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200')"
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">Our Story</h1>
          <p className="font-poppins text-lg md:text-xl max-w-2xl mx-auto">
            Crafting timeless elegance with passion and precision since our beginning
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                A Legacy of Elegance
              </h2>
              <div className="space-y-4 font-poppins text-gray-600 leading-relaxed">
                <p>
                  Shimmer Rose Boutique was born from a passion for creating jewelry that tells a story. 
                  Our journey began with a simple belief: every piece of jewelry should be as unique 
                  and beautiful as the person wearing it.
                </p>
                <p>
                  With decades of experience in fine jewelry craftsmanship, our artisans combine 
                  traditional techniques with contemporary design to create pieces that are both 
                  timeless and modern. Each item in our collection is carefully selected for its 
                  quality, beauty, and ability to capture special moments.
                </p>
                <p>
                  From engagement rings that mark the beginning of forever to everyday pieces that 
                  add sparkle to ordinary moments, we believe jewelry has the power to celebrate 
                  life's most precious occasions.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600" 
                alt="Jewelry craftsmanship"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-lightgrey">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="font-poppins text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do, from design to customer service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-3">Quality Craftsmanship</h3>
              <p className="font-poppins text-gray-600">
                Every piece is meticulously crafted using the finest materials and time-honored techniques, 
                ensuring lasting beauty and durability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-3">Personal Touch</h3>
              <p className="font-poppins text-gray-600">
                We believe jewelry is deeply personal. Our team works closely with you to find or 
                create pieces that reflect your individual style and story.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-3">Trust & Transparency</h3>
              <p className="font-poppins text-gray-600">
                From ethical sourcing to honest pricing, we maintain the highest standards of 
                integrity in all our business practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Artisans
            </h2>
            <p className="font-poppins text-gray-600 max-w-2xl mx-auto">
              The talented hands and creative minds behind every beautiful piece
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300" 
                alt="Master Jeweler"
                className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2">Sarah Mitchell</h3>
              <p className="font-poppins text-primary font-medium mb-2">Master Jeweler</p>
              <p className="font-poppins text-gray-600 text-sm">
                With over 20 years of experience, Sarah leads our design team and specializes in 
                custom engagement rings and fine jewelry restoration.
              </p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300" 
                alt="Gemologist"
                className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2">David Chen</h3>
              <p className="font-poppins text-primary font-medium mb-2">Certified Gemologist</p>
              <p className="font-poppins text-gray-600 text-sm">
                David ensures every stone meets our exacting standards. His expertise in gem selection 
                and certification guarantees the quality of our pieces.
              </p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300" 
                alt="Designer"
                className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2">Emily Rodriguez</h3>
              <p className="font-poppins text-primary font-medium mb-2">Creative Director</p>
              <p className="font-poppins text-gray-600 text-sm">
                Emily brings fresh, contemporary designs to our collection while honoring traditional 
                craftsmanship techniques passed down through generations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
