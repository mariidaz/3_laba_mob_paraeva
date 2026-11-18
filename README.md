# Side A (.NET MAUI)

Мобільний та десктопний щоденник музичних відкриттів, реалізований на платформі **.NET MAUI (XAML + C# / MVVM)**. Застосунок допомагає шукати альбоми через каталог Apple Music (iTunes Search API), зберігати їх у власній бібліотеці та записувати оцінки, настрій і враження.

## Структура проєкту

- `Models/` — моделі даних (`Album`, `AlbumNote`, допоміжні стани інтерфейсу `FilterChip`, `MoodOption`, `RatingStarItem`, `PrincipleItem`).
- `Services/` — сервісний шар:
  - `ItunesService.cs` — пошук альбомів через `https://itunes.apple.com/search` із фільтрацією контенту;
  - `LibraryService.cs` — локальне збереження обраних альбомів і нотаток у JSON (`FileSystem.AppDataDirectory`).
- `ViewModels/` — шари представлення за патерном MVVM (`DiscoverViewModel`, `JournalViewModel`, `AboutViewModel`, `AlbumDetailViewModel`, `ArtistViewModel`, `NoteEditorViewModel`).
- `Views/` — XAML-сторінки (`DiscoverPage`, `JournalPage`, `AboutPage`, `AlbumDetailPage`, `ArtistPage`, `NoteEditorPage`).
- `AppShell.xaml` — нижня навігація за вкладками (`ВІДКРИВАТИ`, `ЩОДЕННИК`, `ПРО ПРОЄКТ`) та маршрутизація до екранів деталей альбому, виконавця й редактора нотаток.

## Запуск проєкту

```powershell
dotnet build SideA.csproj
dotnet run --project SideA.csproj
```
