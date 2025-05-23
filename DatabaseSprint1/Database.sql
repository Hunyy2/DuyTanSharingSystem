USE [UniversitySharingPlatform]
GO
/****** Object:  Table [dbo].[CommentLikes]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentLikes](
	[Id] [uniqueidentifier] NOT NULL,
	[CommentId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[IsLike] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Comments]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comments](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[PostId] [uniqueidentifier] NULL,
	[Content] [nvarchar](500) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[IsDeleted] [bit] NULL,
	[UpdatedAt] [datetime] NULL,
	[ParentCommentId] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmailVerificationTokens]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmailVerificationTokens](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[Token] [nvarchar](255) NOT NULL,
	[ExpiryDate] [datetime] NOT NULL,
	[IsUsed] [bit] NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Friendships]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Friendships](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[FriendId] [uniqueidentifier] NULL,
	[CreatedAt] [datetime] NULL,
	[Status] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Friendship] UNIQUE NONCLUSTERED 
(
	[UserId] ASC,
	[FriendId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GroupMembers]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupMembers](
	[Id] [uniqueidentifier] NOT NULL,
	[GroupId] [uniqueidentifier] NULL,
	[UserId] [uniqueidentifier] NULL,
	[JoinedAt] [datetime] NULL,
	[Role] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Groups]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Groups](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[CreatedBy] [uniqueidentifier] NULL,
	[CreatedAt] [datetime] NULL,
	[Description] [nvarchar](max) NULL,
	[Privacy] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Likes]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Likes](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[PostId] [uniqueidentifier] NULL,
	[CreatedAt] [datetime] NULL,
	[IsLike] [bit] NULL,
	[IsDeleted] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LocationUpdates]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LocationUpdates](
	[Id] [uniqueidentifier] NOT NULL,
	[RideId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[IsDriver] [bit] NOT NULL,
	[Latitude] [float] NOT NULL,
	[Longitude] [float] NOT NULL,
	[Speed] [float] NULL,
	[Timestamp] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Messages]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Messages](
	[Id] [uniqueidentifier] NOT NULL,
	[SenderId] [uniqueidentifier] NULL,
	[ReceiverId] [uniqueidentifier] NULL,
	[Content] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[IsRead] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Posts]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Posts](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[Content] [nvarchar](max) NOT NULL,
	[ImageUrl] [nvarchar](255) NULL,
	[VideoUrl] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
	[Score] [float] NULL,
	[IsApproved] [bit] NULL,
	[UpdateAt] [datetime] NULL,
	[PostType] [int] NULL,
	[ApprovalStatus] [int] NOT NULL,
	[Scope] [int] NULL,
	[IsSharedPost] [bit] NULL,
	[OriginalPostId] [uniqueidentifier] NULL,
	[IsDeleted] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ratings]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ratings](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[RatedByUserId] [uniqueidentifier] NOT NULL,
	[RideId] [uniqueidentifier] NOT NULL,
	[Level] [int] NOT NULL,
	[Comment] [nvarchar](500) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RefreshTokens]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RefreshTokens](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[Token] [nvarchar](255) NOT NULL,
	[ExpiryDate] [datetime] NOT NULL,
	[IsRevoked] [bit] NULL,
	[IsUsed] [bit] NULL,
	[CreatedByIp] [nvarchar](45) NULL,
	[CreatedAt] [datetime] NULL,
	[ReplacedByToken] [nvarchar](500) NULL,
	[UpdatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reports]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reports](
	[Id] [uniqueidentifier] NOT NULL,
	[ReportedBy] [uniqueidentifier] NULL,
	[PostId] [uniqueidentifier] NULL,
	[Reason] [nvarchar](255) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[Status] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RidePosts]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RidePosts](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[StartLocation] [nvarchar](255) NOT NULL,
	[EndLocation] [nvarchar](255) NOT NULL,
	[StartTime] [datetime] NOT NULL,
	[PostType] [int] NULL,
	[Status] [int] NULL,
	[CreatedAt] [datetime] NULL,
	[Content] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RideReports]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RideReports](
	[Id] [uniqueidentifier] NOT NULL,
	[RideId] [uniqueidentifier] NOT NULL,
	[PassengerId] [uniqueidentifier] NOT NULL,
	[Message] [nvarchar](500) NOT NULL,
	[AlertType] [int] NOT NULL,
	[Status] [bit] NOT NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rides]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rides](
	[Id] [uniqueidentifier] NOT NULL,
	[PassengerId] [uniqueidentifier] NULL,
	[RidePostId] [uniqueidentifier] NULL,
	[DriverId] [uniqueidentifier] NULL,
	[StartTime] [datetime] NULL,
	[EndTime] [datetime] NULL,
	[EstimatedDuration] [int] NULL,
	[Status] [int] NULL,
	[Fare] [decimal](10, 2) NULL,
	[CreatedAt] [datetime] NULL,
	[IsSafetyTrackingEnabled] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Shares]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shares](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[PostId] [uniqueidentifier] NULL,
	[CreatedAt] [datetime] NULL,
	[Content] [nvarchar](max) NULL,
	[IsDeleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StudyMaterials]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudyMaterials](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[Title] [nvarchar](255) NOT NULL,
	[FileUrl] [nvarchar](255) NOT NULL,
	[Subject] [nvarchar](100) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 31/03/2025 5:05:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [uniqueidentifier] NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[ProfilePicture] [nvarchar](255) NULL,
	[Bio] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
	[IsVerifiedEmail] [bit] NULL,
	[TrustScore] [decimal](10, 2) NULL,
	[Role] [int] NULL,
	[RelativePhone] [varchar](20) NULL,
	[Phone] [varchar](20) NULL,
	[LastActive] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CommentLikes] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[CommentLikes] ADD  DEFAULT ((1)) FOR [IsLike]
GO
ALTER TABLE [dbo].[CommentLikes] ADD  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Comments] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Comments] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Comments] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Comments] ADD  DEFAULT (NULL) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[EmailVerificationTokens] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[EmailVerificationTokens] ADD  DEFAULT ((0)) FOR [IsUsed]
GO
ALTER TABLE [dbo].[EmailVerificationTokens] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Friendships] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Friendships] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Friendships] ADD  CONSTRAINT [DF__Friendshi__Statu__0F624AF8]  DEFAULT ((0)) FOR [Status]
GO
ALTER TABLE [dbo].[GroupMembers] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[GroupMembers] ADD  DEFAULT (getdate()) FOR [JoinedAt]
GO
ALTER TABLE [dbo].[Groups] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Groups] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Groups] ADD  DEFAULT ('Public') FOR [Privacy]
GO
ALTER TABLE [dbo].[Likes] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Likes] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Likes] ADD  DEFAULT ((0)) FOR [IsLike]
GO
ALTER TABLE [dbo].[Likes] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[LocationUpdates] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[LocationUpdates] ADD  DEFAULT ((0)) FOR [IsDriver]
GO
ALTER TABLE [dbo].[LocationUpdates] ADD  DEFAULT (sysdatetime()) FOR [Timestamp]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT ((0)) FOR [IsRead]
GO
ALTER TABLE [dbo].[Posts] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Posts] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Posts] ADD  DEFAULT ((0)) FOR [Score]
GO
ALTER TABLE [dbo].[Posts] ADD  DEFAULT ((1)) FOR [IsApproved]
GO
ALTER TABLE [dbo].[Posts] ADD  DEFAULT (getdate()) FOR [UpdateAt]
GO
ALTER TABLE [dbo].[Posts] ADD  CONSTRAINT [DF_Posts_Scope]  DEFAULT ((0)) FOR [Scope]
GO
ALTER TABLE [dbo].[Posts] ADD  DEFAULT ((0)) FOR [IsSharedPost]
GO
ALTER TABLE [dbo].[Posts] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Ratings] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Ratings] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[RefreshTokens] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[RefreshTokens] ADD  DEFAULT ((0)) FOR [IsRevoked]
GO
ALTER TABLE [dbo].[RefreshTokens] ADD  DEFAULT ((0)) FOR [IsUsed]
GO
ALTER TABLE [dbo].[RefreshTokens] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Reports] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Reports] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Reports] ADD  CONSTRAINT [DF__Reports__Status__6EF57B66]  DEFAULT ((0)) FOR [Status]
GO
ALTER TABLE [dbo].[RidePosts] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[RidePosts] ADD  DEFAULT ((0)) FOR [Status]
GO
ALTER TABLE [dbo].[RidePosts] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[RideReports] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[RideReports] ADD  DEFAULT ((0)) FOR [AlertType]
GO
ALTER TABLE [dbo].[RideReports] ADD  DEFAULT ((0)) FOR [Status]
GO
ALTER TABLE [dbo].[RideReports] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Rides] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Rides] ADD  DEFAULT ((0)) FOR [Status]
GO
ALTER TABLE [dbo].[Rides] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Rides] ADD  DEFAULT ((0)) FOR [IsSafetyTrackingEnabled]
GO
ALTER TABLE [dbo].[Shares] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Shares] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Shares] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[StudyMaterials] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[StudyMaterials] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [IsVerifiedEmail]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [Role]
GO
ALTER TABLE [dbo].[CommentLikes]  WITH CHECK ADD FOREIGN KEY([CommentId])
REFERENCES [dbo].[Comments] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CommentLikes]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([Id])
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_ParentComment] FOREIGN KEY([ParentCommentId])
REFERENCES [dbo].[Comments] ([Id])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_ParentComment]
GO
ALTER TABLE [dbo].[EmailVerificationTokens]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Friendships]  WITH CHECK ADD FOREIGN KEY([FriendId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Friendships]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[GroupMembers]  WITH CHECK ADD FOREIGN KEY([GroupId])
REFERENCES [dbo].[Groups] ([Id])
GO
ALTER TABLE [dbo].[GroupMembers]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Groups]  WITH CHECK ADD FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Likes]  WITH CHECK ADD FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([Id])
GO
ALTER TABLE [dbo].[Likes]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[LocationUpdates]  WITH CHECK ADD  CONSTRAINT [FK_LocationUpdates_Rides] FOREIGN KEY([RideId])
REFERENCES [dbo].[Rides] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[LocationUpdates] CHECK CONSTRAINT [FK_LocationUpdates_Rides]
GO
ALTER TABLE [dbo].[LocationUpdates]  WITH CHECK ADD  CONSTRAINT [FK_LocationUpdates_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[LocationUpdates] CHECK CONSTRAINT [FK_LocationUpdates_Users]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD FOREIGN KEY([ReceiverId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD FOREIGN KEY([SenderId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD FOREIGN KEY([OriginalPostId])
REFERENCES [dbo].[Posts] ([Id])
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[RefreshTokens]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Reports]  WITH CHECK ADD FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([Id])
GO
ALTER TABLE [dbo].[Reports]  WITH CHECK ADD FOREIGN KEY([ReportedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[RidePosts]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Rides]  WITH CHECK ADD FOREIGN KEY([DriverId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Rides]  WITH CHECK ADD FOREIGN KEY([PassengerId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Rides]  WITH CHECK ADD FOREIGN KEY([RidePostId])
REFERENCES [dbo].[RidePosts] ([Id])
GO
ALTER TABLE [dbo].[Shares]  WITH CHECK ADD FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([Id])
GO
ALTER TABLE [dbo].[Shares]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[StudyMaterials]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[GroupMembers]  WITH CHECK ADD CHECK  (([Role]='Admin' OR [Role]='Moderator' OR [Role]='Member'))
GO
ALTER TABLE [dbo].[Groups]  WITH CHECK ADD CHECK  (([Privacy]='Secret' OR [Privacy]='Private' OR [Privacy]='Public'))
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD  CONSTRAINT [CK_ApprovalStatus] CHECK  (([ApprovalStatus]=(2) OR [ApprovalStatus]=(1) OR [ApprovalStatus]=(0)))
GO
ALTER TABLE [dbo].[Posts] CHECK CONSTRAINT [CK_ApprovalStatus]
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD  CONSTRAINT [CK_PostType] CHECK  (([PostType]=(4) OR [PostType]=(3) OR [PostType]=(2) OR [PostType]=(1) OR [PostType]=(0)))
GO
ALTER TABLE [dbo].[Posts] CHECK CONSTRAINT [CK_PostType]
GO
ALTER TABLE [dbo].[Ratings]  WITH CHECK ADD CHECK  (([Level]>=(1) AND [Level]<=(4)))
GO
ALTER TABLE [dbo].[RidePosts]  WITH CHECK ADD CHECK  (([PostType]=(1) OR [PostType]=(0)))
GO
ALTER TABLE [dbo].[RidePosts]  WITH CHECK ADD CHECK  (([Status]=(2) OR [Status]=(1) OR [Status]=(0)))
GO
ALTER TABLE [dbo].[RideReports]  WITH CHECK ADD CHECK  (([AlertType]=(2) OR [AlertType]=(1) OR [AlertType]=(0)))
GO
ALTER TABLE [dbo].[Rides]  WITH CHECK ADD CHECK  (([Status]=(3) OR [Status]=(2) OR [Status]=(1) OR [Status]=(0)))
GO
