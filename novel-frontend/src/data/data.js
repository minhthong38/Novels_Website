// src/data/data.js
export const novels = [
    {
        NovelID: 1,
        Title: 'TƯ DUY NGƯỢC',
        Description: 'Description of TƯ DUY NGƯỢC',
        AuthorID: 1,
        Views: 100,
        CategoryID: 1,
        Created_at: '2025-01-01T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://i.imgur.com/OoGAP3P.png'
    },
    {
        NovelID: 2,
        Title: 'KÍNH VẠN HOA',
        Description: 'Description of KÍNH VẠN HOA',
        AuthorID: 2,
        Views: 200,
        CategoryID: 2,
        Created_at: '2025-01-15T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1336126336i/13633451.jpg'
    },
    {
        NovelID: 3,
        Title: 'TUỔI TRẺ ĐÁNG GIÁ BAO NHIÊU?',
        Description: 'Description of TUỔI TRẺ ĐÁNG GIÁ BAO NHIÊU?',
        AuthorID: 1,
        Views: 150,
        CategoryID: 3,
        Created_at: '2025-02-01T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1495635816i/32521178.jpg'
    },
    {
        NovelID: 4,
        Title: 'CHUYẾN XE CỦA QUỶ',
        Description: 'Description of CHUYẾN XE CỦA QUỶ',
        AuthorID: 2,
        Views: 250,
        CategoryID: 4,
        Created_at: '2025-02-10T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://i.pinimg.com/originals/7d/c4/de/7dc4de2c23908ecc3d3fe15ce21ee6ae.png?epik=dj0yJnU9Wll3Y0N1Qkdzdmdxc09taEp3Nnl6dzVWRzV1RFhpSTkmcD0wJm49c0plazlHbndNRV9hTVhkNUlpQkRRUSZ0PUFBQUFBR0FaLWE0'
    },
    {
        NovelID: 5,
        Title: 'TA BA LÔ TRÊN ĐẤT Á',
        Description: 'Description of TA BA LÔ TRÊN ĐẤT Á',
        AuthorID: 1,
        Views: 180,
        CategoryID: 5,
        Created_at: '2025-02-20T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://img.websosanh.vn/v10/users/review/images/894fsk3kgocyy/sach-ta-ba-lo-tren-dat-a.jpg?compress=85&width=660'
    },
    {
        NovelID: 6,
        Title: 'ĐẮC NHÂN TÂM',
        Description: 'Description of ĐẮC NHÂN TÂM',
        AuthorID: 2,
        Views: 300,
        CategoryID: 6,
        Created_at: '2025-03-01T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://i.imgur.com/dPSZ21C.png'
    },
    {
        NovelID: 7,
        Title: 'HARRY POTTER',
        Description: 'Description of HARRY POTTER',
        AuthorID: 3,
        Views: 500,
        CategoryID: 8,
        Created_at: '2025-03-10T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg'
    },
    {
        NovelID: 8,
        Title: 'THE HOBBIT',
        Description: 'Description of THE HOBBIT',
        AuthorID: 4,
        Views: 600,
        CategoryID: 8,
        Created_at: '2025-03-20T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg'
    },
    {
        NovelID: 9,
        Title: 'THE GREAT GATSBY',
        Description: 'Description of THE GREAT GATSBY',
        AuthorID: 5,
        Views: 700,
        CategoryID: 7,
        Created_at: '2025-04-01T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg'
    },
    {
        NovelID: 10,
        Title: '1984',
        Description: 'Description of 1984',
        AuthorID: 6,
        Views: 800,
        CategoryID: 7,
        Created_at: '2025-04-10T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg'
    },
    {
        NovelID: 12,
        Title: 'THE MOST HUMAN HUMAN',
        Description: 'Description of THE MOST HUMAN HUMAN',
        AuthorID: 8,
        Views: 1000,
        CategoryID: 7,
        Created_at: '2025-04-20T12:19:00',
        Updated_at: '2025-02-05T12:19:00',
        ImageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81A-mvlo+QL.jpg'
    }
];

export const categories = [
    { id: 1, name: 'Tư Duy, Kỹ năng' },
    { id: 2, name: 'Thiếu nhi' },
    { id: 3, name: 'Phát triển bản thân' },
    { id: 4, name: 'Kinh dị' },
    { id: 5, name: 'Du lịch' },
    { id: 6, name: 'Kỹ năng sống' },
    { id: 7, name: 'Tiểu thuyết' },
    { id: 8, name: 'Viễn tưởng' }
];

export const novelContents = {
    1: {
      title: 'TƯ DUY NGƯỢC',
      banners: [
        "https://i.imgur.com/OoGAP3P.png",
        "https://example.com/banner1-2.png",
        "https://example.com/banner1-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Tôi đã học như thế nào.',
          content: [
            "Những thói quen tốt ta hình thành khi còn trẻ không tạo nên khác biệt nhỏ nào, đúng hơn, chúng tạo ra tất cả khác biệt.",
            "Luyện tập thể lực Các hoạt động như chạy bộ, tập gym ngoài trời thường không tốn nhiều chi phí. Đi bơi chỉ vài nghìn đồng một vé, hoặc tham gia các lớp học võ ở trung tâm thể thao quận huyện cũng rất rẻ. Nếu chịu khó tìm kiếm, bạn sẽ thấy nhiều câu lạc bộ rèn luyện sức khỏe miễn phí gần nơi ở. Luyện tập thể lực không chỉ giúp bạn có một sức khỏe tốt mà còn cải thiện tinh thần, đào thải độc tố tích tụ từ môi trường và thực phẩm không lành mạnh. Một cơ thể khỏe mạnh là nền tảng cho một cuộc sống tốt đẹp. Hơn nữa, tham gia các cộng đồng luyện tập còn giúp mở rộng mối quan hệ, tầm nhìn, và quan điểm về cuộc sống.",
            "Đọc sách Tri thức nhân loại phần lớn nằm trong sách. Báo và tạp chí chỉ chứa thông tin ngắn hạn, trong khi mạng xã hội hiện nay thường tràn ngập tin rác. Đọc sách giúp bạn thay đổi cuộc đời. Khi tinh thần xuống dốc, không muốn làm gì, hãy thử đọc sách. Sách không chỉ nâng cao kiến thức mà còn truyền cảm hứng, thúc đẩy hành động tích cực hơn. Dù sách giấy không rẻ, bạn có thể tìm các trang web cung cấp ebook miễn phí hoặc chọn đọc sách tiếng Anh để vừa học kiến thức vừa nâng cao từ vựng. Hãy đặt mục tiêu đọc một cuốn sách mỗi tuần, và sau một năm bạn sẽ thấy sự khác biệt lớn trong vốn hiểu biết của mình.",
            "Học trực tuyến Các khóa học trực tuyến cung cấp kiến thức về nhiều lĩnh vực như nghệ thuật, lịch sử, kinh tế, lập trình, thiên văn học, vũ trụ... Bạn chỉ cần tạo tài khoản và bắt đầu học. Học trực tuyến đang ngày càng phổ biến, bổ sung và thay thế hình thức giáo dục truyền thống. Ưu điểm của nó là bạn không cần di chuyển, tự chọn thời gian học phù hợp, và có thể học nhiều kỹ năng hữu ích mà trường lớp chưa dạy. Hãy tận dụng thời gian rảnh để tham gia các khóa học, học thêm kỹ năng mới hoặc nâng cao kiến thức chuyên môn, thay vì chìm đắm trong những nỗi buồn vô ích.",
            "Cho dân du lịch bụi ở nhờ Hiện nay, nhiều bạn trẻ thích đi du lịch bụi. Trong khi chưa đủ điều kiện để đi, bạn có thể tham gia cho khách du lịch ở nhờ tại nhà mình. Những trải nghiệm này không chỉ giúp bạn có thêm bạn bè quốc tế mà còn nhận được những câu chuyện lữ hành thú vị. Nếu không tiện cho ở nhờ, bạn có thể gặp gỡ, trò chuyện hoặc dẫn khách đi tham quan xung quanh khu vực sinh sống.",
            "Đi du lịch bụi không cần quá nhiều tiền. Bạn có thể đến các tỉnh gần nơi mình ở trong ngày, hoặc nếu có thời gian, hãy thử hành trình dài hơn trong kỳ nghỉ hè. Chìa khóa của du lịch bụi không nằm ở số tiền bạn có mà là sự can đảm. Can đảm bước ra khỏi vùng an toàn, làm điều mới, và trải nghiệm. Có thể đi bộ, đi xe đạp, hoặc đi nhờ xe. Ngoài ra, bạn cũng có thể làm việc tình nguyện để đổi lấy nơi ăn ở. Những chuyến đi sẽ giúp bạn hiểu đời, hiểu người hơn, và mang lại nhiều kỷ niệm không thể quên."
          ]
        }
      ]
    },
    2: {
      title: 'KÍNH VẠN HOA',
      banners: [
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1336126336i/13633451.jpg",
        "https://example.com/banner2-2.png",
        "https://example.com/banner2-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Những người bạn tuổi thơ.',
          content: [
            "Kính Vạn Hoa đưa chúng ta vào thế giới tuổi thơ với những trò chơi, cuộc phiêu lưu và cả những bài học quý giá. Đọc Kính Vạn Hoa không chỉ để giải trí mà còn để tìm lại những ký ức đẹp đã qua.",
            "Trong Kính Vạn Hoa, chúng ta sẽ gặp lại những người bạn cũ, như Quý Ròm thông minh, nhạy bén; Hạnh, cô bé hiền lành, tốt bụng; và Tiểu Long khỏe mạnh, dũng cảm. Họ cùng nhau trải qua những cuộc phiêu lưu đầy thú vị và học được nhiều bài học về tình bạn, lòng dũng cảm và sự chân thành.",
            "Hãy cùng khám phá những câu chuyện đầy sắc màu và học hỏi những bài học quý giá từ Kính Vạn Hoa.",
            "Những trò chơi dân gian như nhảy dây, bắn bi, đá cầu... đã trở thành một phần không thể thiếu trong tuổi thơ của nhiều người. Kính Vạn Hoa giúp chúng ta nhớ lại những kỷ niệm đẹp ấy và truyền cảm hứng cho thế hệ trẻ tiếp tục giữ gìn và phát huy những giá trị văn hóa truyền thống.",
            "Cuộc phiêu lưu của Quý Ròm, Hạnh và Tiểu Long không chỉ dừng lại ở những trò chơi mà còn mở rộng ra những chuyến đi xa, khám phá những vùng đất mới và gặp gỡ những con người thú vị. Mỗi câu chuyện trong Kính Vạn Hoa đều chứa đựng những bài học quý giá về tình bạn, lòng dũng cảm và sự chân thành.",
            "Kính Vạn Hoa không chỉ là một cuốn sách giải trí mà còn là một nguồn cảm hứng vô tận cho những ai muốn tìm lại tuổi thơ và khám phá những giá trị đích thực trong cuộc sống."
          ]
        }
      ]
    },
    3: {
      title: 'TUỔI TRẺ ĐÁNG GIÁ BAO NHIÊU?',
      banners: [
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1495635816i/32521178.jpg",
        "https://example.com/banner3-2.png",
        "https://example.com/banner3-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Tôi đã học như thế nào.',
          content: [
            "Những thói quen tốt ta hình thành khi còn trẻ không tạo nên khác biệt nhỏ nào, đúng hơn, chúng tạo ra tất cả khác biệt.",
            "Luyện tập thể lực Các hoạt động như chạy bộ, tập gym ngoài trời thường không tốn nhiều chi phí. Đi bơi chỉ vài nghìn đồng một vé, hoặc tham gia các lớp học võ ở trung tâm thể thao quận huyện cũng rất rẻ. Nếu chịu khó tìm kiếm, bạn sẽ thấy nhiều câu lạc bộ rèn luyện sức khỏe miễn phí gần nơi ở. Luyện tập thể lực không chỉ giúp bạn có một sức khỏe tốt mà còn cải thiện tinh thần, đào thải độc tố tích tụ từ môi trường và thực phẩm không lành mạnh. Một cơ thể khỏe mạnh là nền tảng cho một cuộc sống tốt đẹp. Hơn nữa, tham gia các cộng đồng luyện tập còn giúp mở rộng mối quan hệ, tầm nhìn, và quan điểm về cuộc sống.",
            "Đọc sách Tri thức nhân loại phần lớn nằm trong sách. Báo và tạp chí chỉ chứa thông tin ngắn hạn, trong khi mạng xã hội hiện nay thường tràn ngập tin rác. Đọc sách giúp bạn thay đổi cuộc đời. Khi tinh thần xuống dốc, không muốn làm gì, hãy thử đọc sách. Sách không chỉ nâng cao kiến thức mà còn truyền cảm hứng, thúc đẩy hành động tích cực hơn. Dù sách giấy không rẻ, bạn có thể tìm các trang web cung cấp ebook miễn phí hoặc chọn đọc sách tiếng Anh để vừa học kiến thức vừa nâng cao từ vựng. Hãy đặt mục tiêu đọc một cuốn sách mỗi tuần, và sau một năm bạn sẽ thấy sự khác biệt lớn trong vốn hiểu biết của mình.",
            "Học trực tuyến Các khóa học trực tuyến cung cấp kiến thức về nhiều lĩnh vực như nghệ thuật, lịch sử, kinh tế, lập trình, thiên văn học, vũ trụ... Bạn chỉ cần tạo tài khoản và bắt đầu học. Học trực tuyến đang ngày càng phổ biến, bổ sung và thay thế hình thức giáo dục truyền thống. Ưu điểm của nó là bạn không cần di chuyển, tự chọn thời gian học phù hợp, và có thể học nhiều kỹ năng hữu ích mà trường lớp chưa dạy. Hãy tận dụng thời gian rảnh để tham gia các khóa học, học thêm kỹ năng mới hoặc nâng cao kiến thức chuyên môn, thay vì chìm đắm trong những nỗi buồn vô ích.",
            "Cho dân du lịch bụi ở nhờ Hiện nay, nhiều bạn trẻ thích đi du lịch bụi. Trong khi chưa đủ điều kiện để đi, bạn có thể tham gia cho khách du lịch ở nhờ tại nhà mình. Những trải nghiệm này không chỉ giúp bạn có thêm bạn bè quốc tế mà còn nhận được những câu chuyện lữ hành thú vị. Nếu không tiện cho ở nhờ, bạn có thể gặp gỡ, trò chuyện hoặc dẫn khách đi tham quan xung quanh khu vực sinh sống.",
            "Đi du lịch bụi không cần quá nhiều tiền. Bạn có thể đến các tỉnh gần nơi mình ở trong ngày, hoặc nếu có thời gian, hãy thử hành trình dài hơn trong kỳ nghỉ hè. Chìa khóa của du lịch bụi không nằm ở số tiền bạn có mà là sự can đảm. Can đảm bước ra khỏi vùng an toàn, làm điều mới, và trải nghiệm. Có thể đi bộ, đi xe đạp, hoặc đi nhờ xe. Ngoài ra, bạn cũng có thể làm việc tình nguyện để đổi lấy nơi ăn ở. Những chuyến đi sẽ giúp bạn hiểu đời, hiểu người hơn, và mang lại nhiều kỷ niệm không thể quên."
          ]
        }
      ]
    },
    4: {
      title: 'CHUYẾN XE CỦA QUỶ',
      banners: [
        "https://radiotoday.net/wp-content/uploads/2018/12/chuyen-ma-co-that-cua-bac-tai-xe.jpg",
        "https://genk.mediacdn.vn/2019/6/5/photo-1-1559701651308356929005.jpg",
        "https://vnn-imgs-f.vgcloud.vn/2019/10/31/16/anh-1-cac-nhan-vat-trong-chuyen-co-tich-phu-thuy-ac-quy-cong-chua-tren-cung-mot-xe.jpg"
      ],
      parts: [
        {
          title: 'Phần 1: Cuộc gặp gỡ định mệnh.',
          content: [
            "Chuyến xe của quỷ dẫn dắt người đọc vào một hành trình đầy ám ảnh và rùng rợn. Những câu chuyện ma quái, những hiện tượng kỳ bí sẽ làm bạn không thể rời mắt khỏi từng trang sách.",
            "Trong chuyến xe định mệnh ấy, những hành khách bất đắc dĩ phải đối mặt với nỗi sợ hãi sâu thẳm nhất của mình. Họ phải vượt qua những thử thách khắc nghiệt và tìm cách thoát khỏi bàn tay của quỷ dữ.",
            "Chuyến xe của quỷ không chỉ là một câu chuyện kinh dị, mà còn là một bài học về sự dũng cảm và lòng kiên trì trong cuộc sống.",
            "Những hiện tượng kỳ bí xảy ra liên tiếp trên chuyến xe, khiến các hành khách không khỏi hoang mang và lo sợ. Họ phải tìm cách giải mã những bí ẩn và đối mặt với những thử thách đầy nguy hiểm.",
            "Trong cuộc hành trình đầy ám ảnh này, các hành khách không chỉ phải đối mặt với nỗi sợ hãi mà còn phải học cách tin tưởng và hỗ trợ lẫn nhau. Sự đoàn kết và lòng dũng cảm sẽ giúp họ vượt qua những thử thách khắc nghiệt và tìm ra lối thoát.",
            "Chuyến xe của quỷ không chỉ là một câu chuyện kinh dị mà còn là một bài học về sự dũng cảm, lòng kiên trì và tình người trong những hoàn cảnh khó khăn."
          ]
        }
      ]
    },
    5: {
      title: 'TA BA LÔ TRÊN ĐẤT Á',
      banners: [
        "https://img.websosanh.vn/v10/users/review/images/894fsk3kgocyy/sach-ta-ba-lo-tren-dat-a.jpg",
        "https://example.com/banner5-2.png",
        "https://example.com/banner5-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Những bước chân đầu tiên.',
          content: [
            "Ta ba lô trên đất Á kể về hành trình khám phá những vùng đất mới, những nền văn hóa đặc sắc và những con người thú vị trên khắp châu Á.",
            "Những chuyến đi không chỉ mang lại những trải nghiệm đáng nhớ mà còn giúp ta mở rộng tầm nhìn, học hỏi nhiều điều mới mẻ và trưởng thành hơn trong cuộc sống.",
            "Qua mỗi trang sách, bạn sẽ cảm nhận được niềm đam mê du lịch và tình yêu với cuộc sống của tác giả, cùng với những câu chuyện chân thực và sống động từ các chuyến đi của anh.",
            "Những bước chân đầu tiên trên hành trình khám phá châu Á đầy thú vị và thử thách. Tác giả chia sẻ những kinh nghiệm quý báu và những câu chuyện đầy cảm hứng từ các chuyến đi của mình.",
            "Từ những thành phố sầm uất đến những ngôi làng hẻo lánh, mỗi nơi đều mang đến những trải nghiệm độc đáo và những bài học quý giá. Tác giả không chỉ khám phá những địa danh nổi tiếng mà còn tìm hiểu về văn hóa, con người và cuộc sống ở những nơi mình đi qua.",
            "Ta ba lô trên đất Á không chỉ là một cuốn sách du lịch mà còn là một nguồn cảm hứng cho những ai yêu thích khám phá và muốn trải nghiệm những điều mới mẻ trong cuộc sống."
          ]
        }
      ]
    },
    6: {
      title: 'ĐẮC NHÂN TÂM',
      banners: [
        "https://i.imgur.com/dPSZ21C.png",
        "https://example.com/banner6-2.png",
        "https://example.com/banner6-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Nghệ thuật giao tiếp.',
          content: [
            "Đắc nhân tâm là một cuốn sách kinh điển về nghệ thuật giao tiếp và xây dựng mối quan hệ. Những nguyên tắc và bài học trong sách đã giúp hàng triệu người trên thế giới cải thiện kỹ năng giao tiếp và đạt được thành công trong cuộc sống.",
            "Cuốn sách cung cấp những lời khuyên quý giá về cách lắng nghe, thấu hiểu và tạo thiện cảm với người khác. Đắc nhân tâm không chỉ giúp bạn trở thành một người giao tiếp giỏi mà còn giúp bạn xây dựng những mối quan hệ bền vững và đáng tin cậy.",
            "Hãy áp dụng những nguyên tắc trong Đắc nhân tâm vào cuộc sống hàng ngày và bạn sẽ thấy sự khác biệt rõ rệt trong cách mọi người đối xử với bạn.",
            "Nghệ thuật giao tiếp không chỉ là việc nói chuyện mà còn là việc lắng nghe và thấu hiểu người khác. Đắc nhân tâm giúp bạn nắm vững những kỹ năng cần thiết để trở thành một người giao tiếp giỏi và xây dựng những mối quan hệ tốt đẹp.",
            "Cuốn sách cung cấp những bài học quý giá về cách tạo thiện cảm, thuyết phục và ảnh hưởng đến người khác. Những nguyên tắc trong Đắc nhân tâm đã được kiểm chứng qua thời gian và áp dụng thành công trong nhiều lĩnh vực khác nhau.",
            "Đắc nhân tâm không chỉ giúp bạn cải thiện kỹ năng giao tiếp mà còn giúp bạn trở thành một người tốt hơn, biết quan tâm và tôn trọng người khác. Hãy đọc và áp dụng những bài học trong cuốn sách này để đạt được thành công và hạnh phúc trong cuộc sống."
          ]
        }
      ]
    },
    7: {
      title: 'HARRY POTTER',
      banners: [
        "https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg",
        "https://example.com/banner7-2.png",
        "https://example.com/banner7-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Hòn đá phù thủy.',
          content: [
            "Harry Potter là một loạt truyện viễn tưởng nổi tiếng kể về cuộc phiêu lưu của cậu bé phù thủy Harry Potter tại trường Hogwarts.",
            "Trong phần đầu tiên, Hòn đá phù thủy, Harry phát hiện ra mình là một phù thủy và được mời nhập học tại trường Hogwarts. Tại đây, cậu gặp gỡ những người bạn mới và bắt đầu cuộc hành trình khám phá thế giới phù thủy.",
            "Hòn đá phù thủy là một cuốn sách đầy kỳ ảo và hấp dẫn, đưa người đọc vào một thế giới phép thuật đầy màu sắc và bí ẩn.",
            "Harry Potter và những người bạn của mình phải đối mặt với nhiều thử thách và nguy hiểm trong cuộc hành trình tìm kiếm Hòn đá phù thủy. Họ phải vượt qua những cạm bẫy, giải mã những bí ẩn và đối đầu với những thế lực đen tối.",
            "Cuộc phiêu lưu của Harry Potter không chỉ là một câu chuyện về phép thuật mà còn là một bài học về tình bạn, lòng dũng cảm và sự hy sinh. Những giá trị này được thể hiện qua từng trang sách và làm say mê hàng triệu độc giả trên khắp thế giới.",
            "Hòn đá phù thủy là phần mở đầu cho một loạt truyện kỳ ảo đầy hấp dẫn và lôi cuốn. Hãy cùng Harry Potter khám phá thế giới phép thuật và trải nghiệm những cuộc phiêu lưu đầy kỳ thú."
          ]
        }
      ]
    },
    8: {
      title: 'THE MOST HUMAN HUMAN',
      banners: [
        "https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg",
        "https://example.com/banner8-2.png",
        "https://example.com/banner8-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Hành trình của những chiếc nhẫn.',
          content: [
            "Lord of the Rings là một câu chuyện viễn tưởng kể về cuộc chiến giữa thiện và ác trong một thế giới huyền bí.",
            "Trong phần đầu tiên, Hành trình của những chiếc nhẫn, nhóm bạn của Frodo Baggins bắt đầu cuộc phiêu lưu để tiêu diệt chiếc nhẫn quyền năng và chống lại thế lực bóng tối.",
            "Cuốn sách mang đến những tình tiết hồi hộp, những trận chiến gay cấn và những mối quan hệ đầy cảm xúc giữa các nhân vật.",
            "Hành trình của những chiếc nhẫn không chỉ là một cuộc phiêu lưu đầy nguy hiểm mà còn là một bài học về tình bạn, lòng dũng cảm và sự hy sinh. Những giá trị này được thể hiện qua từng trang sách và làm say mê hàng triệu độc giả trên khắp thế giới.",
            "Cuộc chiến giữa thiện và ác trong Lord of the Rings không chỉ là một cuộc chiến về sức mạnh mà còn là một cuộc chiến về ý chí và lòng kiên trì. Những nhân vật trong truyện phải đối mặt với nhiều thử thách và nguy hiểm để bảo vệ những giá trị cao đẹp của mình.",
            "Lord of the Rings là một tác phẩm kinh điển, mang đến những bài học quý giá về tình bạn, lòng dũng cảm và sự hy sinh. Hãy cùng Frodo Baggins và những người bạn của mình khám phá thế giới huyền bí và trải nghiệm những cuộc phiêu lưu đầy kỳ thú."
          ]
        }
      ]
    },
    9: {
      title: 'THE GREAT GATSBY',
      banners: [
        "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
        "https://example.com/banner9-2.png",
        "https://example.com/banner9-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Bí ẩn của Gatsby.',
          content: [
            "The Great Gatsby kể về cuộc sống xa hoa và bí ẩn của Jay Gatsby, một triệu phú trẻ tuổi, và tình yêu của anh với Daisy Buchanan.",
            "Cuốn sách là một bức tranh sống động về thời kỳ Roaring Twenties ở Mỹ, với những bữa tiệc xa hoa, những mối quan hệ phức tạp và những giấc mơ không thành hiện thực.",
            "The Great Gatsby là một tác phẩm kinh điển, khắc họa sâu sắc những khía cạnh tăm tối và ánh sáng của giấc mơ Mỹ.",
            "Bí ẩn của Gatsby không chỉ là câu chuyện về tình yêu mà còn là câu chuyện về sự tham vọng và những giấc mơ không thành hiện thực. Jay Gatsby là một nhân vật đầy bí ẩn, với những mối quan hệ phức tạp và những bí mật chưa được tiết lộ.",
            "Cuộc sống xa hoa và những bữa tiệc xa hoa của Gatsby là một bức tranh sống động về thời kỳ Roaring Twenties ở Mỹ. Những mối quan hệ phức tạp và những giấc mơ không thành hiện thực của các nhân vật trong truyện đã tạo nên một tác phẩm kinh điển, khắc họa sâu sắc những khía cạnh tăm tối và ánh sáng của giấc mơ Mỹ.",
            "The Great Gatsby là một tác phẩm kinh điển, mang đến những bài học quý giá về tình yêu, sự tham vọng và những giấc mơ không thành hiện thực. Hãy cùng khám phá bí ẩn của Gatsby và trải nghiệm những câu chuyện đầy cảm xúc trong cuốn sách này."
          ]
        }
      ]
    },
    10: {
      title: '1984',
      banners: [
        "https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg",
        "https://example.com/banner10-2.png",
        "https://example.com/banner10-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Thế giới của Big Brother.',
          content: [
            "1984 là một tác phẩm kinh điển của George Orwell, mô tả một thế giới độc tài toàn trị, nơi mọi hành động và tư tưởng của con người đều bị kiểm soát chặt chẽ.",
            "Nhân vật chính, Winston Smith, sống trong một xã hội bị giám sát bởi 'Big Brother' và cố gắng tìm kiếm sự tự do và sự thật.",
            "Cuốn sách là một lời cảnh báo về nguy cơ của chủ nghĩa toàn trị và tầm quan trọng của tự do cá nhân.",
            "Thế giới của Big Brother là một thế giới đầy ám ảnh và rùng rợn, nơi mọi hành động và tư tưởng của con người đều bị kiểm soát chặt chẽ. Winston Smith, nhân vật chính, sống trong một xã hội bị giám sát bởi 'Big Brother' và cố gắng tìm kiếm sự tự do và sự thật.",
            "1984 là một tác phẩm kinh điển, mang đến những bài học quý giá về nguy cơ của chủ nghĩa toàn trị và tầm quan trọng của tự do cá nhân. Cuốn sách là một lời cảnh báo về những nguy cơ tiềm ẩn trong xã hội hiện đại và tầm quan trọng của việc bảo vệ quyền tự do và sự thật.",
            "Hãy cùng khám phá thế giới của Big Brother và trải nghiệm những câu chuyện đầy ám ảnh và rùng rợn trong cuốn sách này."
          ]
        }
      ]
    },
    12: {
      title: 'THE MOST HUMAN HUMAN',
      banners: [
        "https://images-na.ssl-images-amazon.com/images/I/81A-mvlo+QL.jpg",
        "https://example.com/banner11-2.png",
        "https://example.com/banner11-3.png"
      ],
      parts: [
        {
          title: 'Phần 1: Gặp gỡ Mr. Darcy.',
          content: [
            "Pride and Prejudice là một tác phẩm kinh điển của Jane Austen, kể về câu chuyện tình yêu giữa Elizabeth Bennet và Mr. Darcy.",
            "Cuốn sách khắc họa một cách tinh tế những mối quan hệ xã hội, tình yêu và những định kiến trong xã hội Anh vào thế kỷ 19.",
            "Pride and Prejudice là một tác phẩm lãng mạn, đầy mỉa mai và sắc bén về những giá trị và niềm tin của con người.",
            "Gặp gỡ Mr. Darcy là một trong những khoảnh khắc đáng nhớ nhất trong Pride and Prejudice. Elizabeth Bennet, nhân vật chính, gặp gỡ Mr. Darcy, một người đàn ông giàu có và kiêu ngạo, và từ đó bắt đầu một câu chuyện tình yêu đầy mỉa mai và sắc bén.",
            "Cuốn sách khắc họa một cách tinh tế những mối quan hệ xã hội, tình yêu và những định kiến trong xã hội Anh vào thế kỷ 19. Những giá trị và niềm tin của con người được thể hiện qua từng trang sách, tạo nên một tác phẩm lãng mạn và đầy cảm xúc.",
            "Pride and Prejudice là một tác phẩm kinh điển, mang đến những bài học quý giá về tình yêu, sự kiêu ngạo và những định kiến trong xã hội. Hãy cùng khám phá câu chuyện tình yêu giữa Elizabeth Bennet và Mr. Darcy và trải nghiệm những cảm xúc đầy mỉa mai và sắc bén trong cuốn sách này."
          ]
        }
      ]
    },
};


const sortedNovelsByViews = novels.slice().sort((a, b) => b.Views - a.Views);

export const topNovels = sortedNovelsByViews.slice(0, 10).map(novel => ({
    id: novel.NovelID,
    title: novel.Title,
    imageUrl: novel.ImageUrl
}));

export const topReaders = [
    { id: 1, name: 'Ronaldo', imageUrl: 'https://static.znews.vn/static/topic/person/cristiano-ronaldo.jpg' },
    { id: 2, name: 'Messi', imageUrl: 'https://static.znews.vn/static/topic/person/messi.jpg' },
    { id: 3, name: 'Mbappe', imageUrl: 'https://static01.nyt.com/images/2023/06/12/multimedia/12soccer-mbappe-fjhg/12soccer-mbappe-fjhg-mediumSquareAt3X.jpg' },
    { id: 4, name: 'Neymar', imageUrl: 'https://static.znews.vn/static/topic/person/neymar.jpg' },
    { id: 5, name: 'Lewandowski', imageUrl: 'https://static.znews.vn/static/topic/person/lewandowski.jpg' },
    { id: 6, name: 'Salah', imageUrl: 'https://static.znews.vn/static/topic/person/salah.jpg' },
    { id: 7, name: 'Kane', imageUrl: 'https://static.znews.vn/static/topic/person/kane.jpg' },
    { id: 8, name: 'Hazard', imageUrl: 'https://static.znews.vn/static/topic/person/hazard.jpg' },
    { id: 9, name: 'De Bruyne', imageUrl: 'https://static.znews.vn/static/topic/person/de-bruyne.jpg' },
    { id: 10, name: 'Modric', imageUrl: 'https://static.znews.vn/static/topic/person/modric.jpg' }
];

export const topAuthors = [
    { id: 1, name: 'NGUYỄN NHẬT ÁNH', imageUrl: 'https://phunuvietnam.mediacdn.vn/media/news/44c9a4254627e41e9842bbf690a37dcc/1-nv.jpg' },
    { id: 2, name: 'ROSIE NGUYỄN', imageUrl: 'https://example.com/rosie-nguyen.jpg' },
    { id: 3, name: 'HAMLET TRƯƠNG', imageUrl: 'https://example.com/hamlet-truong.jpg' },
    { id: 4, name: 'J.K. ROWLING', imageUrl: 'https://example.com/jk-rowling.jpg' },
    { id: 5, name: 'J.R.R. TOLKIEN', imageUrl: 'https://example.com/jrr-tolkien.jpg' },
    { id: 6, name: 'F. SCOTT FITZGERALD', imageUrl: 'https://example.com/f-scott-fitzgerald.jpg' },
    { id: 7, name: 'GEORGE ORWELL', imageUrl: 'https://example.com/george-orwell.jpg' },
    { id: 8, name: 'JANE AUSTEN', imageUrl: 'https://example.com/jane-austen.jpg' },
    { id: 9, name: 'STEPHEN KING', imageUrl: 'https://example.com/stephen-king.jpg' },
    { id: 10, name: 'AGATHA CHRISTIE', imageUrl: 'https://example.com/agatha-christie.jpg' }
];

export const users = [
  { id: 1, img: "https://blog.maika.ai/wp-content/uploads/2024/02/anh-meo-meme-8.jpg", username: "meomeo01", password: "111111", level: "VIP 5" },
  { id: 2, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSgjs2sCO0xh0Ve1Sf8mDtBt2UhO9GRZImDw&s", username: "meo2bim", password: "222222", level: "VIP 3" },
  { id: 3, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdHtPqWpMvl_UAqFCb_bWTPWQuQW7hAvD2Hw&s", username: "huhuhu", password: "333333", level: "VIP 2" },
  { id: 4, img: "https://www.thepoetmagazine.org/wp-content/uploads/2024/06/avatar-meme-meo.jpg", username: "rose04", password: "444444", level: "VIP 3" },
  { id: 5, img: "https://megaweb.vn/blog/uploads/images/meme-meo-cute-1.jpg", username: "meovang", password: "555555", level: "VIP 0" },
  { id: 6, img: "https://dulichnghialo.vn/wp-content/uploads/2024/10/anh-meo-bua-87uHbuJ3.jpg", username: "cudamsamset", password: "666666", level: "VIP 4" },
];

export const registerUser = (user) => {
  const newUser = {
    id: users.length + 1, // Assign a new ID
    img: user.avatar || 'https://via.placeholder.com/150', // Use a URL instead of base64
    username: user.username,
    password: user.password,
    fullName: user.fullName, // Add fullName field
    level: 'VIP 0', // Default level
    email: user.email,
    role: user.role,
    gender: user.gender,
  };
  users.push(newUser);

  // Store only essential user details in localStorage
  const minimalUser = {
    id: newUser.id,
    fullName: newUser.fullName, // Include fullName
    username: newUser.username,
    email: newUser.email,
    img: newUser.img, // Use URL or placeholder
    role: newUser.role,
  };
  try {
    localStorage.setItem('loggedInUser', JSON.stringify(minimalUser)); // Store minimal user details
  } catch (error) {
    console.error('Failed to store user in localStorage:', error);
  }
  return newUser;
};
