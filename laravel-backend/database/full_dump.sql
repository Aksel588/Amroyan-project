/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_time` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keywords` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `canonical_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` VALUES ('01998ae9-800d-72c8-86de-624be6bbb43b','sdfasfsadf','<p>sadfsadfsadfsadf</p>','sadfsaf','sdfasfsadf','Admin','asfsafsdf','5 min read','dfasdfasdf','asdfasfas','asdfasdfasf','asdfsdfsadf','http://127.0.0.1:8000/storage/blog-images/1758972170_d8X5s1YaK6.webp','[]',0,1,'6','2025-09-27 07:23:02','2025-09-27 07:23:05');
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
DROP TABLE IF EXISTS `calculator_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calculator_rates` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calculator_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` decimal(10,4) NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `effective_from` timestamp NULL DEFAULT NULL,
  `effective_to` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calculator_rates_calculator_id_foreign` (`calculator_id`),
  CONSTRAINT `calculator_rates_calculator_id_foreign` FOREIGN KEY (`calculator_id`) REFERENCES `calculators` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `calculator_rates` DISABLE KEYS */;
INSERT INTO `calculator_rates` VALUES ('019898f8-373e-70fe-90c6-ba6b5db203b6','019898f8-3738-729d-92ee-1a3d58f6dba7','Եկամտային հարկ',20.0000,1,1,NULL,NULL,'2025-08-11 07:51:00','2025-08-11 07:51:00'),('019898f8-373f-721e-9715-72e10133df1e','019898f8-3738-729d-92ee-1a3d58f6dba7','Կուտակային վճար',10.0000,2,1,NULL,NULL,'2025-08-11 07:51:00','2025-08-11 07:51:00'),('019898f8-373f-721e-9715-72e10208a876','019898f8-3738-729d-92ee-1a3d58f6dba7','Դրոշմանիշային վճար',1500.0000,3,1,NULL,NULL,'2025-08-11 07:51:00','2025-08-11 07:51:00'),('019898f8-3740-719f-8c5d-4ae504ae8bbb','019898f8-3740-719f-8c5d-4ae503dbfc8d','ԱԱՀ (20%)',20.0000,1,1,NULL,NULL,'2025-08-11 07:51:00','2025-08-11 07:51:00'),('019898f8-3741-722a-ade9-9d9127635e6d','019898f8-3740-719f-8c5d-4ae503dbfc8d','ԱԱՀ (0%)',0.0000,2,1,NULL,NULL,'2025-08-11 07:51:00','2025-08-11 07:51:00');
/*!40000 ALTER TABLE `calculator_rates` ENABLE KEYS */;
DROP TABLE IF EXISTS `calculators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calculators` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `calculators_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `calculators` DISABLE KEYS */;
INSERT INTO `calculators` VALUES ('019898f8-3738-729d-92ee-1a3d58f6dba7','Աշխատավարձի հաշվիչ','salary','Հաշվեք գրանցված ↔ մաքուր աշխատավարձը՝ հաշվի առնելով եկամտային հարկը, կուտակային վճարներն ու դրոշմանիշային վճարը','Calculator',1,1,'2025-08-11 07:51:00','2025-08-11 07:51:00'),('019898f8-3740-719f-8c5d-4ae503dbfc8d','ԱԱՀ հաշվիչ','vat','Հաշվեք ԱԱՀ-ն և գինը ԱԱՀ-ով','Calculator',2,1,'2025-08-11 07:51:00','2025-08-11 07:51:00'),('019898f8-3741-722a-ade9-9d9127e610b4','Շահութահարկի հաշվիչ','profit-tax','Հաշվեք շահութահարկը և մաքուր շահույթը','Calculator',3,1,'2025-08-11 07:51:00','2025-08-11 07:51:00'),('019898f8-3742-70b3-b37e-dfe3173fb2cb','Նպաստի հաշվիչ','benefit','Հաշվեք տարբեր տեսակի նպաստները՝ երեխայի խնամք, հիվանդություն, ծննդաբերություն և այլն','Calculator',4,1,'2025-08-11 07:51:00','2025-08-11 08:00:37'),('019898f8-3742-70b3-b37e-dfe3183b42e2','Նախագծային հաշվիչ','estimate','Հաշվեք նախագծերի արժեքը և գնահատումները','Calculator',5,1,'2025-08-11 07:51:00','2025-08-11 07:51:00'),('01998a9f-9834-7133-8ced-7ce577677daf','Աշխատավարձի հաշվիչ (լրիվ)','comprehensive-salary','Հաշվեք աշխատավարձի ֆոնդը, հարկերը, ծախսերը և վերջնական գինը՝ ժամավճարային, օրավճարային և ամսավճարային դիրքերով','Calculator',6,1,'2025-09-27 06:02:19','2025-09-27 06:02:19'),('01998ab6-be77-706d-bf78-873f6b807bab','Շրջանառության հարկի հաշվիչ','turnover-tax','Հաշվեք եռամսյակային շրջանառության հարկը՝ տարբեր գործունեության տեսակների համար՝ հանելով ծախսերը և ստուգելով նվազագույն հարկը','Calculator',7,1,'2025-09-27 06:27:36','2025-09-27 06:27:36'),('01998abe-f1e4-7202-aa7c-a66a1e54aab9','Հայաստանի հարկային հաշվիչ','armenian-tax','Հաշվեք շահութահարկը՝ եկամուտներ, ծախսեր, կորուստներ, նվազեցումներ և հարկվող շահույթ՝ 79 տողի ամբողջական հարկային աղյուսակով','Calculator',8,1,'2025-09-27 06:36:33','2025-09-27 06:36:33'),('01998acf-4981-7097-ae8b-d053b02af229','Հայաստանի աշխատավարձի հաշվիչ','armenian-payroll','Հաշվեք կեղտոտ/մաքուր աշխատավարձը՝ եկամտահարկ, սոցիալական վճարներ և դրոշմանիշային վճար','Calculator',9,1,'2025-09-27 06:54:24','2025-09-27 06:54:24');
/*!40000 ALTER TABLE `calculators` ENABLE KEYS */;
DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES ('01989905-1175-7047-b2da-87f6775938ea','AKSEL 1.0','elliotprog23@gmail.com','asdfsafd','sadfsfd','094816631','Հաշվապահական քաղաքականության մշակում',1,'2025-08-11 08:05:02','2025-08-11 08:05:15'),('019c281c-ebab-70a3-a68a-81affcbbbf85','Aksel Aghajanyan','aksel.dev.588@gmail.com','LinksBook','gkygj','094816631','Հաշվապահական քաղաքականության մշակում',1,'2026-02-04 06:05:09','2026-02-04 06:05:36');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
DROP TABLE IF EXISTS `course_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_applications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `processed_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_from` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `course_applications` DISABLE KEYS */;
INSERT INTO `course_applications` VALUES ('01989935-3373-72c7-b570-52ba0c49fa12','Անի Սարգսյան','ani.sargsyan@example.com','+374 91 123 456','Ինտերես ունեմ հաշվապահական դասընթացներին մասնակցելու համար: Կարո՞ղ եմ ստանալ լրացուցիչ տեղեկություններ:','pending',NULL,'services-page',NULL,'2025-08-11 08:57:37','2025-08-11 08:57:37'),('01989935-3378-70c1-b582-67cbb19cbd9a','Հայկ Մարտիրոսյան','hayk.martirosyan@example.com','+374 93 234 567','Ուզում եմ սովորել հաշվապահական հաշվառում: Ե՞րբ են սկսվում հաջորդ դասընթացները:','approved','Admin','website','Հաստատված է հաջորդ դասընթացին մասնակցելու համար: Կապ հաստատել էլ. փոստով:','2025-08-11 08:57:37','2025-08-11 08:57:37'),('01989935-3379-706f-9ec5-d70243d9a203','Մարիա Հովհաննիսյան','maria.hovhannisyan@example.com','+374 94 345 678','Կարո՞ղ եմ մասնակցել առցանց դասընթացներին:','approved','Admin','services-page',NULL,'2025-08-11 08:57:37','2025-08-11 09:42:33'),('01989935-3379-706f-9ec5-d70244226009','Գևորգ Աբրահամյան','gevor.abrahamyan@example.com','+374 95 456 789','Որքա՞ն է դասընթացների արժեքը:','pending',NULL,'website',NULL,'2025-08-11 08:57:37','2025-08-11 08:57:37'),('01989935-337a-71dc-8f8d-a17e97bf3d34','Լուսինե Գրիգորյան','lusine.grigoryan@example.com','+374 96 567 890','Կարո՞ղ եմ ստանալ վկայական դասընթացների ավարտից հետո:','cancelled','Admin','services-page','Չեղարկված է հաճախորդի խնդրանքով:','2025-08-11 08:57:37','2025-08-11 08:57:37'),('0198993a-d36d-7173-887e-59a095e9364a','Test User','test@example.com','+374 99 999 999','Test message','pending',NULL,'test',NULL,'2025-08-11 09:03:46','2025-08-11 09:03:46'),('0198993b-aacd-726f-957f-87ca3e0f750c','Test User','test@example.com','+374 99 999 999','Test message','pending',NULL,'curl-test',NULL,'2025-08-11 09:04:41','2025-08-11 09:04:41'),('0198994c-5aaf-7181-9e21-c6477c2e3776','Test User','test@example.com','+374 99 999 999','Test message','pending',NULL,'test',NULL,'2025-08-11 09:22:54','2025-08-11 09:22:54'),('01989956-1456-71a5-b351-319a91037b9e','AKSEL 1.0','aksel@linkaiapps.com','094816631','Դիմում դասընթացների համար - գլխավոր էջից','approved','Admin','main_page_course_card',NULL,'2025-08-11 09:33:32','2025-08-11 09:35:44'),('01989957-974b-7259-b0dc-6c1dfa55c2c4','AKSEL 1.0','elliotprog23@gmail.com','094816631','Դիմում դասընթացների համար - գլխավոր էջից','approved','Admin','main_page_course_card',NULL,'2025-08-11 09:35:11','2025-08-11 09:35:33'),('0198995d-e5e7-73cd-8791-15632c57a5fc','AKSEL 1.0','aksel@linkaiapps.com','094816631','Դիմում դասընթացների համար - գլխավոր էջից','approved','Admin','main_page_course_card',NULL,'2025-08-11 09:42:04','2025-08-11 09:42:17'),('01998a93-f4a7-70b2-b257-f3e47352857c','Test User','test@example.com','+374123456789','Test application','pending',NULL,NULL,NULL,'2025-09-27 05:49:36','2025-09-27 05:49:36');
/*!40000 ALTER TABLE `course_applications` ENABLE KEYS */;
DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` enum('standards','pek_notifications','clarifications_tax','clarifications_labor','discussions','tests_accounting_finance','tests_hr') COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mime_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT '0',
  `uploaded_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES ('01989890-574f-721f-aaf9-cb035c5121f0','sfdasdf','asdfsadf','pek_notifications','anhatakan-2.pdf','http://127.0.0.1:8000/storage/documents/1754906253_ebU4CWN7C4.pdf','application/pdf',67394,1,'anonymous',1,'2025-08-11 05:57:33','2025-08-11 07:38:04'),('019898c0-311a-71b5-b736-3bc9a15ef830','afsadfsa','sadfasfadsf','clarifications_labor','anhatakan.pdf','http://127.0.0.1:8000/storage/documents/1754909389_LbdKdZCJ1M.pdf','application/pdf',67721,1,'anonymous',1,'2025-08-11 06:49:49','2025-08-11 08:02:48');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_08_08_191751_create_blog_posts_table',1),(5,'2025_08_08_191754_create_calculators_table',1),(6,'2025_08_08_191756_create_calculator_rates_table',1),(7,'2025_08_08_191758_create_contact_messages_table',1),(8,'2025_08_08_191806_create_documents_table',1),(9,'2025_08_08_191809_create_course_applications_table',1),(10,'2025_08_08_191907_create_profiles_table',1),(11,'2025_08_08_194654_change_name_to_role_in_users_table',1),(12,'2025_08_08_195345_create_personal_access_tokens_table',1),(13,'2025_08_08_213115_create_settings_table',1),(14,'2025_08_09_093813_create_newsletters_table',2),(15,'2025_08_11_122215_fix_blog_posts_featured_image_urls',3),(16,'2025_08_11_125627_add_notes_to_course_applications_table',4);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
DROP TABLE IF EXISTS `newsletters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletters` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletters_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `newsletters` DISABLE KEYS */;
INSERT INTO `newsletters` VALUES (1,'test@example.com',1,'2025-08-09 05:41:58',NULL,'2025-08-09 05:41:58','2025-08-09 05:41:58'),(2,'newtest@example.com',1,'2025-08-09 05:45:42',NULL,'2025-08-09 05:45:42','2025-08-09 05:45:42');
/*!40000 ALTER TABLE `newsletters` ENABLE KEYS */;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','407d2af178d20c5632f77a00b2bc91e3a2a05173e3432be6bf991539cdbc9270','[\"*\"]',NULL,NULL,'2025-08-09 05:28:45','2025-08-09 05:28:45'),(2,'App\\Models\\User',1,'auth_token','f7bd24f33a92779cd773696bdea90452e619645ebba0156549e751503921577a','[\"*\"]','2025-08-09 05:29:52',NULL,'2025-08-09 05:29:37','2025-08-09 05:29:52'),(3,'App\\Models\\User',2,'auth_token','42c50def3b07ac9ad61bee440bdfc3f8e20ff94d90d0e8199899d49956597d11','[\"*\"]','2025-08-09 05:31:50',NULL,'2025-08-09 05:31:40','2025-08-09 05:31:50'),(4,'App\\Models\\User',2,'auth_token','81ee7456971bfb26b6655f4d82c0f4ed65c5eab5ad2e771e18821247f620f9db','[\"*\"]','2025-08-09 05:34:37',NULL,'2025-08-09 05:32:07','2025-08-09 05:34:37'),(5,'App\\Models\\User',3,'auth_token','c5c5ada8ebf183a52b3caaa2519e191613ee9ae781999f02920ca33aa5b7234e','[\"*\"]','2025-08-09 05:33:31',NULL,'2025-08-09 05:33:23','2025-08-09 05:33:31'),(6,'App\\Models\\User',2,'auth_token','d1fe98dd8ac28971f36be7c5e887d4e48f68bf93c42bda0622436c02a0314b7a','[\"*\"]','2025-08-11 06:00:41',NULL,'2025-08-09 05:46:46','2025-08-11 06:00:41'),(7,'App\\Models\\User',3,'auth_token','e7e27c3a651d5dea4ea06eb0b9c25a8bbafe5f84ad40069c8988936dc3e17668','[\"*\"]','2025-08-09 05:48:00',NULL,'2025-08-09 05:47:50','2025-08-09 05:48:00'),(8,'App\\Models\\User',2,'auth_token','8f0a4ca404ccc46a30f3acace0dde7f8a56c94cc5ef58a0d652169c0ef54e011','[\"*\"]','2025-08-11 06:03:47',NULL,'2025-08-11 06:02:56','2025-08-11 06:03:47'),(9,'App\\Models\\User',2,'auth_token','7ee351f82fc5c9cd7b20a6de2ec35a216a56f9d4a35d777be72abc9ce8d24cb7','[\"*\"]','2025-08-11 06:04:02',NULL,'2025-08-11 06:04:01','2025-08-11 06:04:02'),(10,'App\\Models\\User',2,'auth_token','aebc21a20ca75606572825e01530a981942b95f9b77743b52f14b9453605e000','[\"*\"]','2025-08-11 06:08:59',NULL,'2025-08-11 06:07:32','2025-08-11 06:08:59'),(11,'App\\Models\\User',2,'auth_token','e65f06eed405c134bd2d91b6f79459553413816aed8961ea5f6df3cc1197ab9a','[\"*\"]','2025-08-11 06:10:38',NULL,'2025-08-11 06:10:33','2025-08-11 06:10:38'),(12,'App\\Models\\User',2,'auth_token','f4289d40a1b988d4f3d5dd21650c05d2a279ee47a03f9211d5fe57d5931d9169','[\"*\"]','2025-08-11 06:11:43',NULL,'2025-08-11 06:10:47','2025-08-11 06:11:43'),(13,'App\\Models\\User',2,'auth_token','bff3bf37b11c8671364670c3800b33177ad2779a4516a932b95499726d877afe','[\"*\"]','2025-08-11 06:13:35',NULL,'2025-08-11 06:13:35','2025-08-11 06:13:35'),(14,'App\\Models\\User',2,'auth_token','18d8eae678708d9a7f2f4940be6176bae6f0ddd99a4fa8550723b638ff7d6e9c','[\"*\"]','2025-08-11 06:14:10',NULL,'2025-08-11 06:14:10','2025-08-11 06:14:10'),(15,'App\\Models\\User',2,'auth_token','85af185c5b9351f82e1572fe2a113cf33a9b88d596e598044d0f13dd2b84f3ee','[\"*\"]','2025-08-11 06:18:34',NULL,'2025-08-11 06:15:47','2025-08-11 06:18:34'),(16,'App\\Models\\User',2,'auth_token','3b05dafc0ab772dbc51783531c894bf675889bde2ac9a9173276f26115fdae12','[\"*\"]','2025-08-11 06:18:56',NULL,'2025-08-11 06:18:49','2025-08-11 06:18:56'),(17,'App\\Models\\User',2,'auth_token','606b1ff230726922fc9eeb8b2c4d4ae4d1241826a0e54b63471c8b4056d06669','[\"*\"]','2025-08-11 06:19:32',NULL,'2025-08-11 06:19:26','2025-08-11 06:19:32'),(18,'App\\Models\\User',2,'auth_token','e2acbd1c96b87e8974b3281395e0758b8ed89d9c3f345dbbc0086e2f4d5a280c','[\"*\"]','2025-08-11 06:21:12',NULL,'2025-08-11 06:19:50','2025-08-11 06:21:12'),(19,'App\\Models\\User',2,'auth_token','e6283a4e4535f2cbb04482b55b7f5f544f5153274a43793a15bb159d0f85af00','[\"*\"]','2025-08-11 06:26:56',NULL,'2025-08-11 06:22:50','2025-08-11 06:26:56'),(20,'App\\Models\\User',2,'auth_token','289265c71fa02cb41d4cf8438fcc89e2c8528d68e42ce07d053bf8d4037c847a','[\"*\"]','2025-08-11 06:28:31',NULL,'2025-08-11 06:27:33','2025-08-11 06:28:31'),(21,'App\\Models\\User',2,'auth_token','613b25c6ffa19e8a93776ee6e6406d61ff3bd95ecb24c1df108a11ea85c4d408','[\"*\"]','2025-08-11 06:28:38',NULL,'2025-08-11 06:28:38','2025-08-11 06:28:38'),(22,'App\\Models\\User',2,'auth_token','a5e9f564e79ee66f6c34a95be2ce535b3bad570d43f952c2deddb6a10e461036','[\"*\"]','2025-08-11 06:30:27',NULL,'2025-08-11 06:30:27','2025-08-11 06:30:27'),(24,'App\\Models\\User',2,'auth_token','f94b9713cb74c04bb5e943cda404e3d12185d00ce7414504464b7a615687521a','[\"*\"]','2025-08-11 06:43:07',NULL,'2025-08-11 06:42:28','2025-08-11 06:43:07'),(25,'App\\Models\\User',2,'auth_token','8eddec0bb9fd25acb5891b213aa0bc8aa1cd76ef89fbba53e57f53da2eeb9531','[\"*\"]','2025-08-11 06:43:33',NULL,'2025-08-11 06:43:16','2025-08-11 06:43:33'),(27,'App\\Models\\User',2,'auth_token','d07ca5a7ba5f40c55409ae9bbf6b130e0fcf6e3094f2afd55c7b0d0c2f9d539b','[\"*\"]','2025-08-11 12:03:38',NULL,'2025-08-11 06:45:33','2025-08-11 12:03:38'),(28,'App\\Models\\User',4,'auth_token','79f4d592b27cf8628f68251dbe9be01f526fc9d2658b5849c73aed88a5b4e507','[\"*\"]','2025-08-11 06:54:38',NULL,'2025-08-11 06:46:38','2025-08-11 06:54:38'),(29,'App\\Models\\User',5,'auth_token','c14c9a6949b60fc5f3464d16ef52ab011a218dab2301df7ab797091fbb6826a1','[\"*\"]',NULL,NULL,'2025-09-27 05:49:22','2025-09-27 05:49:22'),(30,'App\\Models\\User',6,'auth_token','7ea1d7732ed18dfefb291cd2a27fedf433bfb18f0acd4fcb3208c385d8cb4b9a','[\"*\"]','2025-10-02 03:37:24',NULL,'2025-09-27 05:50:39','2025-10-02 03:37:24'),(31,'App\\Models\\User',6,'auth_token','064a58df58cc4d7bea07b2c9cfb3f9e22d732bed4f1b0db57c7dacabb28ab8dd','[\"*\"]','2025-09-27 07:51:56',NULL,'2025-09-27 07:20:47','2025-09-27 07:51:56'),(32,'App\\Models\\User',6,'auth_token','c9726ee61f8eb081b0a85eef13f3d9c1abcf25fcad639df91a94aab1cbae00c0','[\"*\"]','2025-10-02 07:51:38',NULL,'2025-10-02 07:44:10','2025-10-02 07:51:38'),(33,'App\\Models\\User',6,'auth_token','2b68be2874cbfa80bb6985f5c635ae7668d64459eada9917b9eab195e0fa64ae','[\"*\"]','2026-02-04 06:09:30',NULL,'2026-02-04 05:56:32','2026-02-04 06:09:30'),(34,'App\\Models\\User',7,'auth_token','713ef0f05897ecd8cdd0b650f827f03edc82301686ac792d6f2d1c53657fa850','[\"*\"]','2026-02-04 06:09:55',NULL,'2026-02-04 05:57:19','2026-02-04 06:09:55'),(35,'App\\Models\\User',6,'auth_token','ab78a7682a95d954a6df8b3f15a0d635ac0f4792fbe5af7ab720094092231f67','[\"*\"]','2026-02-04 06:35:33',NULL,'2026-02-04 06:14:07','2026-02-04 06:35:33');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES ('01988e2b-ecff-72eb-a3b2-53f67df268f5','2','akseldeveloper8@gmail.com','user','2025-08-09 05:31:40','2025-08-09 05:31:40'),('01988e2d-7f2d-72f3-a8d1-d988482c622a','3','aksel@linkaiapps.com','user','2025-08-09 05:33:23','2025-08-09 05:33:23'),('019898bd-482e-73b4-963f-64b4721b1aad','4','elliotprog23@gmail.com','user','2025-08-11 06:46:38','2025-08-11 06:46:38'),('01998a93-be44-709d-8d4d-60da93c93258','5','test@example.com','user','2025-09-27 05:49:22','2025-09-27 05:49:22'),('01998a94-ebb1-73bd-b02b-234080985b74','6','akseldeveloper8@gmail.com','user','2025-09-27 05:50:39','2025-09-27 05:50:39'),('019c2815-bc48-7251-af00-ddfb74ac9e21','7','akselaghajanyan@gmail.com','user','2026-02-04 05:57:19','2026-02-04 05:57:19');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('ip13q6ay6rcPxC2SNriRrV2OG0xKZnBDX4r5sTOr',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWUVDY0dzeDVPZDBRSDY4dUNHRDh2NnNhOWc3TWpSSE1jdmRrUmhGMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1770198311);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'maintenanceMode','0','boolean','Enable maintenance mode to restrict site access','2025-08-09 05:32:21','2025-08-09 05:46:53'),(2,'allowRegistration','0','boolean','Allow new user registrations','2025-08-09 05:32:21','2025-08-09 05:46:53'),(3,'emailNotifications','1','boolean','Enable email notifications','2025-08-09 05:32:21','2025-08-09 05:46:53'),(4,'autoBackup','1','boolean','Enable automatic database backups','2025-08-09 05:32:21','2025-08-09 05:46:53'),(5,'siteName','Փաստաթղթային Համակարգ','string','The name of the website','2025-08-09 05:32:21','2025-08-09 05:32:21'),(6,'adminEmail','akseldeveloper8@gmail.com','string','Primary administrator email address','2025-08-09 05:32:21','2025-08-09 05:32:21'),(7,'welcomeMessage','Բարի գալուստ մեր կայք','string','Welcome message displayed to users','2025-08-09 05:32:21','2025-08-09 05:32:21');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (5,'user','test@example.com',NULL,'$2y$12$lhcquO6K0InQ5gIZyJBLG.P8MlFxwbjDbJjS/KC3vB/7uA2Lj71KS',NULL,'2025-09-27 05:49:22','2025-09-27 05:49:22'),(6,'admin','akseldeveloper8@gmail.com',NULL,'$2y$12$PFE6DhhKyJCiDYhj9w7f0ebiG4L.nB8W3WMJeUYItgPO.D7rD.GDa',NULL,'2025-09-27 05:50:39','2025-09-27 05:50:39'),(7,'user','akselaghajanyan@gmail.com',NULL,'$2y$12$EFpeLGBy574x/GnlNMyHneh.XIdrOR7B94uUEBexvVYpoXQyEOz7u',NULL,'2026-02-04 05:57:19','2026-02-04 05:58:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

