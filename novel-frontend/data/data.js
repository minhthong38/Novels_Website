export const users = [
    {
        UserID: 1,
        Username: 'User1',
        Password: 'hashed_password_1',
        Email: 'user1@example.com',
        Role: 'Reader',
        Gender: 'Male',
        Level: 1,
        ExperiencePoints: 0,
        Created_at: '2025-02-05T12:19:00'
    },
    {
        UserID: 2,
        Username: 'User2',
        Password: 'hashed_password_2',
        Email: 'user2@example.com',
        Role: 'Reader',
        Gender: 'Female',
        Level: 1,
        ExperiencePoints: 0,
        Created_at: '2025-02-05T12:19:00'
    }
];

export const authors = [
    {
        AuthorID: 1,
        AuthorName: 'Author1',
        Password: 'hashed_password_1',
        Email: 'author1@example.com',
        Role: 'Author',
        Gender: 'Female',
        Level: 0,
        ExperiencePoints: 0,
        Bio: 'Bio of Author1',
        Created_at: '2025-02-05T12:19:00'
    },
    {
        AuthorID: 2,
        AuthorName: 'Author2',
        Password: 'hashed_password_2',
        Email: 'author2@example.com',
        Role: 'Author',
        Gender: 'Male',
        Level: 0,
        ExperiencePoints: 0,
        Bio: 'Bio of Author2',
        Created_at: '2025-02-05T12:19:00'
    }
];

export const categories = [
    { CategoryID: 1, CategoryName: "Fantasy" },
    { CategoryID: 2, CategoryName: "Science Fiction" },
    { CategoryID: 3, CategoryName: "Romance" }
];

export const novels = [
    {
        NovelID: 1,
        Title: 'Novel1',
        Description: 'Description of Novel1',
        AuthorID: 1,
        Views: 100,
        CategoryID: 1,
        Created_at: '2025-02-05T12:19:00',
        Updated_at: '2025-02-05T12:19:00'
    },
    {
        NovelID: 2,
        Title: 'Novel2',
        Description: 'Description of Novel2',
        AuthorID: 2,
        Views: 200,
        CategoryID: 2,
        Created_at: '2025-02-05T12:19:00',
        Updated_at: '2025-02-05T12:19:00'
    }
];

export const chapters = [
    {
        ChapterID: 1,
        NovelID: 1,
        Title: 'Chapter1 of Novel1',
        Content: 'Content of Chapter1',
        Created_at: '2025-02-05T12:19:00'
    },
    {
        ChapterID: 2,
        NovelID: 1,
        Title: 'Chapter2 of Novel1',
        Content: 'Content of Chapter2',
        Created_at: '2025-02-05T12:19:00'
    }
];

export const readingHistory = [
    {
        HistoryID: 1,
        UserID: 1,
        NovelID: 1,
        ChapterID: 1,
        TimeSpentMinutes: 30,
        Read_at: '2025-02-05T12:19:00'
    }
];

export const ranking = [
    {
        RankingID: 1,
        NovelID: 1,
        AuthorID: 1,
        UserID: 1,
        Views: 100,
        RankDate: '2025-02-05T12:19:00'
    }
];
