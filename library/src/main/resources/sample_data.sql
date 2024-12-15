INSERT INTO `library`.`branches` (`id`, `address`, `city`, `name`) VALUES ('1', 'No. 303, Metropolitan Avenue', 'Metropol', 'Metro Ave Media, Metropol');
INSERT INTO `library`.`branches` (`id`, `address`, `city`, `name`) VALUES ('2', 'No. 208, 7th St. Charter District', 'Liberty City', 'Charter Urban Library, Liberty');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`,`description`) 
VALUES ('1', 'Harper Lee', '1960', 'To Kill a Mockingbird', 'Historical Fiction', 'Book', 'Set in the racially charged American South, this novel explores themes of justice, morality, and compassion through the eyes of a young girl and her father, a principled lawyer.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('2', 'Miguel de Cervantes', '1615', 'Don Quixote', 'Satirical Fiction', 'Book', 'This timeless story follows the misadventures of a delusional knight-errant and his loyal squire, offering a profound critique of idealism and the nature of reality.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('3', 'Gabriel García Márquez', '1967', 'One Hundred Years of Solitude', 'Magical Realism', 'Book', 'A sweeping saga of the Buendía family, where magical elements intertwine with historical and political events to create a rich tapestry of Latin American life.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('4', 'Ian McEwan', '2001', 'Atonement', 'Romance', 'Book', 'A deeply moving exploration of love, guilt, and the devastating effects of a single lie, set against the backdrop of World War II.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('5', 'J.K. Rowling', '1997', 'Harry Potter and the Philosopher\'s Stone', 'Fantasy', 'Book', 'Follow the magical adventures of a young boy who discovers he is a wizard and must navigate the challenges of a mystical school and a dark destiny.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('6', 'J.R.R. Tolkien', '1954', 'The Fellowship of the Ring', 'Fantasy', 'Book', 'The first installment in an epic trilogy that follows a diverse group of heroes on a quest to destroy a powerful ring and save their world.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('7', 'Agatha Christie', '1926', 'The Murder of Roger Ackroyd', 'Mystery', 'Book', 'A masterful murder mystery that keeps readers guessing until its shocking and revolutionary conclusion, redefining the genre.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('8', 'George Orwell', '1945', 'Animal Farm', 'Political Satire', 'Book', 'An allegorical novella that critiques power, corruption, and revolution through the story of a group of farm animals overthrowing their human owner.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('9', 'Jane Austen', '1813', 'Pride and Prejudice', 'Romance', 'Book', 'A brilliant examination of love, class, and societal expectations, centered on the witty and independent Elizabeth Bennet and her evolving relationship with Mr. Darcy.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('10', 'Stephen King', '1977', 'The Shining', 'Horror', 'Book', 'A chilling tale of psychological horror that unfolds as a family becomes isolated in a haunted hotel with a dark and malevolent history.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('11', 'Yuval Noah Harari', '2011', 'Sapiens: A Brief History of Humankind', 'Non-Fiction', 'Book', 'An engaging exploration of the history and evolution of humanity, from ancient hunter-gatherer societies to the challenges of the modern age.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('12', 'Mary Shelley', '1818', 'Frankenstein', 'Science Fiction', 'Book', 'A groundbreaking and haunting story of ambition and creation, where a scientist\'s quest to overcome mortality leads to tragic consequences.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('13', 'F. Scott Fitzgerald', '1925', 'The Great Gatsby', 'Tragedy', 'Book', 'A poignant critique of wealth, ambition, and the American Dream, told through the mysterious and tragic life of Jay Gatsby.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('14', 'Homer', '-800', 'The Odyssey', 'Epic Poetry', 'Book', 'A classic epic poem recounting the heroic adventures of Odysseus as he strives to return home after the Trojan War, overcoming trials and temptations.');

INSERT INTO `library`.`media` (`id`, `author`, `publication_year`, `title`, `genre`, `format`, `description`) 
VALUES ('15', 'Antoine de Saint-Exupéry', '1943', 'The Little Prince', 'Children\'s Literature', 'Book', 'A timeless tale that weaves a poetic narrative of innocence, love, and human nature through the adventures of a young prince traveling among planets.');


INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('1', '0', 'available', '1', '1');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('2', '0', 'available', '1', '2');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('3', '0', 'available', '1', '2');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('4', '0', 'available', '1', '3');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('5', '0', 'available', '1', '4');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('6', '0', 'available', '1', '4');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('7', '0', 'available', '1', '4');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('8', '0', 'available', '1', '4');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('9', '0', 'available', '1', '5');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('10', '0', 'available', '1', '6');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('11', '0', 'available', '1', '7');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('12', '0', 'available', '1', '8');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('13', '0', 'available', '1', '9');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('14', '0', 'available', '1', '10');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('15', '0', 'available', '1', '11');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('16', '0', 'available', '1', '12');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('17', '0', 'available', '1', '13');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('18', '0', 'available', '1', '14');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('19', '0', 'available', '1', '15');

INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('20', '0', 'available', '2', '1');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('21', '0', 'available', '2', '2');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('22', '0', 'available', '2', '3');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('23', '0', 'available', '2', '3');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('24', '0', 'available', '2', '3');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('25', '0', 'available', '2', '4');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('26', '0', 'available', '2', '4');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('27', '0', 'available', '2', '5');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('28', '0', 'available', '2', '5');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('29', '0', 'available', '2', '6');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('30', '0', 'available', '2', '7');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('31', '0', 'available', '2', '8');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('32', '0', 'available', '2', '8');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('33', '0', 'available', '2', '8');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('34', '0', 'available', '2', '11');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('35', '0', 'available', '2', '11');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('36', '0', 'available', '2', '12');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('37', '0', 'available', '2', '13');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('38', '0', 'available', '2', '14');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('39', '0', 'available', '2', '14');
INSERT INTO `library`.`inventory` (`id`, `renewal_count`, `status`, `branch_id`, `media_id`) VALUES ('40', '0', 'available', '2', '15');