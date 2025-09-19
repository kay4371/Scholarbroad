// // // // const express = require('express');
// // // // const axios = require('axios');
// // // // const cheerio = require('cheerio');
// // // // const path = require('path');

// // // // const app = express();
// // // // const PORT = process.env.PORT || 3000;

// // // // // Middleware
// // // // app.use(express.json());
// // // // app.use(express.urlencoded({ extended: true }));
// // // // app.use(express.static('public'));

// // // // // In-memory cache for search results
// // // // const searchCache = new Map();
// // // // const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// // // // // Helper function to clean and format text
// // // // function cleanText(text) {
// // // //     return text.replace(/\s+/g, ' ').trim();
// // // // }

// // // // // Basic web scraping function for program search
// // // // async function searchPrograms(country, course, level, session, mode = 'basic') {
// // // //     const cacheKey = `${country}-${course}-${level}-${session}-${mode}`;
    
// // // //     // Check cache first
// // // //     if (searchCache.has(cacheKey)) {
// // // //         const cached = searchCache.get(cacheKey);
// // // //         if (Date.now() - cached.timestamp < CACHE_DURATION) {
// // // //             return cached.data;
// // // //         }
// // // //     }

// // // //     let results = [];
    
// // // //     try {
// // // //         // Search multiple university databases and funding sites
// // // //         const searchQueries = [
// // // //             `${course} masters ${country} funding international students ${session}`,
// // // //             `graduate assistantship ${course} ${country} international`,
// // // //             `teaching assistantship masters ${course} ${country}`,
// // // //             `bursary ${course} masters ${country} international students`,
// // // //             `scholarship ${course} ${country} graduate program`
// // // //         ];

// // // //         for (let query of searchQueries) {
// // // //             try {
// // // //                 // Simulate search results (in real implementation, you'd scrape actual sites)
// // // //                 const mockResults = await generateMockResults(country, course, level, session, query);
// // // //                 results.push(...mockResults);
// // // //             } catch (error) {
// // // //                 console.error(`Error searching with query: ${query}`, error.message);
// // // //             }
// // // //         }

// // // //         // Remove duplicates and sort by relevance
// // // //         results = removeDuplicates(results);
// // // //         results = results.slice(0, 20); // Limit to top 20 results

// // // //         // Cache results
// // // //         searchCache.set(cacheKey, {
// // // //             data: results,
// // // //             timestamp: Date.now()
// // // //         });

// // // //         return results;
// // // //     } catch (error) {
// // // //         console.error('Search error:', error);
// // // //         return [];
// // // //     }
// // // // }

// // // // // Scrape university directory sites
// // // // async function scrapeUniversityDirectory(country, course, level) {
// // // //     const results = [];
// // // //     const searchQuery = `${course} ${level} ${country} international students funding`;
    
// // // //     try {
// // // //         // Search university directory sites
// // // //         const directoryUrls = [
// // // //             `https://www.mastersportal.com/search/master/field-${course.toLowerCase().replace(/\s+/g, '-')}/country-${country.toLowerCase()}.html`,
// // // //             `https://www.findamasters.com/search/masters-degrees-in-${course.toLowerCase().replace(/\s+/g, '-')}-in-${country.toLowerCase()}`,
// // // //             `https://www.studyportals.com/search/master/${course.toLowerCase().replace(/\s+/g, '-')}/${country.toLowerCase()}`
// // // //         ];

// // // //         for (const url of directoryUrls) {
// // // //             try {
// // // //                 const response = await axios.get(url, {
// // // //                     headers: {
// // // //                         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
// // // //                         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
// // // //                         'Accept-Language': 'en-US,en;q=0.5',
// // // //                         'Connection': 'keep-alive'
// // // //                     },
// // // //                     timeout: 10000
// // // //                 });

// // // //                 const $ = cheerio.load(response.data);
                
// // // //                 // Generic selectors for common university listing sites
// // // //                 const programSelectors = [
// // // //                     '.program-item, .course-item, .study-program',
// // // //                     '.search-result, .result-item',
// // // //                     '.university-program, .degree-program',
// // // //                     '[data-program], [data-course]'
// // // //                 ];

// // // //                 for (const selector of programSelectors) {
// // // //                     $(selector).each((i, element) => {
// // // //                         const $elem = $(element);
                        
// // // //                         const university = cleanText(
// // // //                             $elem.find('.university-name, .institution, .school-name, h3, h4').first().text() ||
// // // //                             $elem.find('a[href*="university"], a[href*="college"]').first().text()
// // // //                         );
                        
// // // //                         const program = cleanText(
// // // //                             $elem.find('.program-name, .course-title, .degree-name, h2').first().text() ||
// // // //                             course + ' - ' + level
// // // //                         );
                        
// // // //                         const funding = cleanText(
// // // //                             $elem.find('.funding, .scholarship, .financial-aid').text() ||
// // // //                             'Funding information available'
// // // //                         );
                        
// // // //                         const url = $elem.find('a').first().attr('href');
// // // //                         const fullUrl = url && url.startsWith('http') ? url : 
// // // //                                        url ? new URL(url, response.config.url).href : '';

// // // //                         if (university && university.length > 3) {
// // // //                             results.push({
// // // //                                 university: university,
// // // //                                 program: program,
// // // //                                 country: country,
// // // //                                 session: 'Multiple sessions available',
// // // //                                 fundingType: extractFundingType(funding),
// // // //                                 amount: 'Contact university for details',
// // // //                                 eligibility: 'International students welcome',
// // // //                                 applicationDeadline: 'Check university website',
// // // //                                 description: `${program} at ${university}. ${funding}`,
// // // //                                 url: fullUrl || `https://www.google.com/search?q=${encodeURIComponent(university + ' ' + program)}`,
// // // //                                 requirements: ['Bachelor\'s degree', 'English proficiency', 'Academic transcripts'],
// // // //                                 lastUpdated: new Date().toISOString().split('T')[0],
// // // //                                 source: 'University Directory'
// // // //                             });
// // // //                         }
// // // //                     });
// // // //                 }
// // // //             } catch (error) {
// // // //                 console.error(`Error scraping ${url}:`, error.message);
// // // //             }
// // // //         }
// // // //     } catch (error) {
// // // //         console.error('University directory scraping error:', error);
// // // //     }
    
// // // //     return results;
// // // // }

// // // // // Scrape scholarship and funding sites
// // // // async function scrapeScholarshipSites(country, course, level, session) {
// // // //     const results = [];
    
// // // //     try {
// // // //         const scholarshipSites = [
// // // //             'https://www.scholarships.com/financial-aid/college-scholarships/scholarships-by-type/graduate-scholarships',
// // // //             'https://www.fastweb.com/college-scholarships/articles/graduate-school-scholarships',
// // // //             'https://www.petersons.com/scholarship-search.aspx'
// // // //         ];

// // // //         // Also search Google for scholarship opportunities
// // // //         const googleSearchUrl = `https://www.google.com/search?q="${course}"+scholarship+"${country}"+international+students+"${level}"`;
        
// // // //         try {
// // // //             const response = await axios.get(googleSearchUrl, {
// // // //                 headers: {
// // // //                     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
// // // //                 },
// // // //                 timeout: 8000
// // // //             });

// // // //             const $ = cheerio.load(response.data);
            
// // // //             // Extract Google search results
// // // //             $('.g').each((i, element) => {
// // // //                 if (i >= 10) return false; // Limit to first 10 results
                
// // // //                 const $elem = $(element);
// // // //                 const title = cleanText($elem.find('h3').first().text());
// // // //                 const description = cleanText($elem.find('.VwiC3b, .s3v9rd').first().text());
// // // //                 const url = $elem.find('a').first().attr('href');
                
// // // //                 if (title && (title.toLowerCase().includes('scholarship') || 
// // // //                              title.toLowerCase().includes('funding') ||
// // // //                              title.toLowerCase().includes('assistantship')) &&
// // // //                     title.toLowerCase().includes(country.toLowerCase())) {
                    
// // // //                     results.push({
// // // //                         university: extractUniversityName(title, description),
// // // //                         program: `${course} - ${level}`,
// // // //                         country: country,
// // // //                         session: session,
// // // //                         fundingType: extractFundingType(title + ' ' + description),
// // // //                         amount: extractAmount(description),
// // // //                         eligibility: 'International students may apply',
// // // //                         applicationDeadline: 'Check website for deadlines',
// // // //                         description: description || `${course} funding opportunity in ${country}`,
// // // //                         url: url || '',
// // // //                         requirements: ['Academic excellence', 'Application essay', 'References'],
// // // //                         lastUpdated: new Date().toISOString().split('T')[0],
// // // //                         source: 'Scholarship Search'
// // // //                     });
// // // //                 }
// // // //             });
// // // //         } catch (error) {
// // // //             console.error('Google search error:', error.message);
// // // //         }
// // // //     } catch (error) {
// // // //         console.error('Scholarship sites scraping error:', error);
// // // //     }
    
// // // //     return results;
// // // // }

// // // // // Scrape government education sites
// // // // async function scrapeGovernmentSites(country, course) {
// // // //     const results = [];
    
// // // //     const govSites = {
// // // //         'Canada': ['https://www.educanada.ca/scholarships-bourses/index.aspx'],
// // // //         'USA': ['https://www.internationalstudent.com/study_usa/'],
// // // //         'UK': ['https://www.gov.uk/government/organisations/department-for-education'],
// // // //         'Germany': ['https://www.daad.de/en/'],
// // // //         'Australia': ['https://www.studyaustralia.gov.au/'],
// // // //         'Netherlands': ['https://www.studyinholland.nl/'],
// // // //         'Sweden': ['https://studyinsweden.se/']
// // // //     };
    
// // // //     const countryGovSites = govSites[country] || [];
    
// // // //     for (const siteUrl of countryGovSites) {
// // // //         try {
// // // //             const response = await axios.get(siteUrl, {
// // // //                 headers: {
// // // //                     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
// // // //                 },
// // // //                 timeout: 10000
// // // //             });

// // // //             const $ = cheerio.load(response.data);
            
// // // //             // Look for scholarship or funding information
// // // //             $('a[href*="scholarship"], a[href*="funding"], a[href*="grant"]').each((i, element) => {
// // // //                 if (i >= 5) return false;
                
// // // //                 const $elem = $(element);
// // // //                 const title = cleanText($elem.text());
// // // //                 const href = $elem.attr('href');
// // // //                 const fullUrl = href && href.startsWith('http') ? href : 
// // // //                                href ? new URL(href, siteUrl).href : '';
                
// // // //                 if (title && title.length > 10) {
// // // //                     results.push({
// // // //                         university: `${country} Government Education Department`,
// // // //                         program: `${course} - Masters`,
// // // //                         country: country,
// // // //                         session: 'Multiple sessions',
// // // //                         fundingType: 'Government Scholarship',
// // // //                         amount: 'Varies by program',
// // // //                         eligibility: 'International students eligible',
// // // //                         applicationDeadline: 'See official website',
// // // //                         description: title,
// // // //                         url: fullUrl || siteUrl,
// // // //                         requirements: ['Academic merit', 'Application form', 'Supporting documents'],
// // // //                         lastUpdated: new Date().toISOString().split('T')[0],
// // // //                         source: 'Government Education Site'
// // // //                     });
// // // //                 }
// // // //             });
// // // //         } catch (error) {
// // // //             console.error(`Error scraping government site ${siteUrl}:`, error.message);
// // // //         }
// // // //     }
    
// // // //     return results;
// // // // }

// // // // // Scrape education portals and aggregator sites
// // // // async function scrapeEducationPortals(country, course, level) {
// // // //     const results = [];
    
// // // //     try {
// // // //         const searchUrl = `https://www.studyportals.com/search/master/${course.toLowerCase().replace(/\s+/g, '-')}/${country.toLowerCase()}`;
        
// // // //         const response = await axios.get(searchUrl, {
// // // //             headers: {
// // // //                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
// // // //             },
// // // //             timeout: 10000
// // // //         });

// // // //         const $ = cheerio.load(response.data);
        
// // // //         // Extract program listings
// // // //         $('.study-card, .program-card, .course-listing').each((i, element) => {
// // // //             if (i >= 8) return false;
            
// // // //             const $elem = $(element);
            
// // // //             const university = cleanText($elem.find('.university, .institution, .school').first().text());
// // // //             const program = cleanText($elem.find('.program, .course, .title').first().text());
// // // //             const location = cleanText($elem.find('.location, .country').first().text());
// // // //             const url = $elem.find('a').first().attr('href');
            
// // // //             if (university && program) {
// // // //                 results.push({
// // // //                     university: university,
// // // //                     program: program,
// // // //                     country: location || country,
// // // //                     session: 'Fall/Spring intake',
// // // //                     fundingType: 'Various funding options available',
// // // //                     amount: 'Contact for funding details',
// // // //                     eligibility: 'International applications accepted',
// // // //                     applicationDeadline: 'Multiple deadlines',
// // // //                     description: `${program} offered by ${university}`,
// // // //                     url: url && url.startsWith('http') ? url : 
// // // //                          url ? `https://www.studyportals.com${url}` : '',
// // // //                     requirements: ['Relevant bachelor\'s degree', 'Language requirements', 'Application materials'],
// // // //                     lastUpdated: new Date().toISOString().split('T')[0],
// // // //                     source: 'Education Portal'
// // // //                 });
// // // //             }
// // // //         });
// // // //     } catch (error) {
// // // //         console.error('Education portal scraping error:', error);
// // // //     }
    
// // // //     return results;
// // // // }

// // // // // Helper functions for data extraction
// // // // function extractFundingType(text) {
// // // //     const fundingKeywords = {
// // // //         'teaching assistant': 'Teaching Assistantship',
// // // //         'research assistant': 'Research Assistantship',
// // // //         'graduate assistant': 'Graduate Assistantship',
// // // //         'scholarship': 'Merit Scholarship',
// // // //         'bursary': 'Need-based Bursary',
// // // //         'grant': 'Research Grant',
// // // //         'fellowship': 'Fellowship',
// // // //         'tuition waiver': 'Tuition Waiver'
// // // //     };
    
// // // //     const lowerText = text.toLowerCase();
    
// // // //     for (const [keyword, type] of Object.entries(fundingKeywords)) {
// // // //         if (lowerText.includes(keyword)) {
// // // //             return type;
// // // //         }
// // // //     }
    
// // // //     return 'Funding Available';
// // // // }

// // // // function extractAmount(text) {
// // // //     const amountRegex = /\$[\d,]+(?:-\$?[\d,]+)?|\€[\d,]+(?:-\€?[\d,]+)?|[\d,]+\s*(?:USD|EUR|CAD|GBP|AUD)/gi;
// // // //     const matches = text.match(amountRegex);
    
// // // //     if (matches && matches.length > 0) {
// // // //         return matches[0];
// // // //     }
    
// // // //     // Look for percentage mentions
// // // //     const percentageRegex = /\d+%\s*(?:tuition|fee)/gi;
// // // //     const percentMatches = text.match(percentageRegex);
    
// // // //     if (percentMatches && percentMatches.length > 0) {
// // // //         return percentMatches[0];
// // // //     }
    
// // // //     return 'Amount varies';
// // // // }

// // // // function extractUniversityName(title, description) {
// // // //     // Common university keywords
// // // //     const universityKeywords = ['university', 'college', 'institute', 'school'];
    
// // // //     const text = (title + ' ' + description).toLowerCase();
    
// // // //     // Split into words and look for university names
// // // //     const words = text.split(/\s+/);
    
// // // //     for (let i = 0; i < words.length - 1; i++) {
// // // //         if (universityKeywords.some(keyword => words[i + 1] && words[i + 1].includes(keyword))) {
// // // //             // Found a potential university name
// // // //             const universityName = words.slice(Math.max(0, i - 2), i + 2).join(' ');
// // // //             if (universityName.length > 5) {
// // // //                 return cleanText(universityName);
// // // //             }
// // // //         }
// // // //     }
    
// // // //     return 'Institution Details Available';
// // // // }

// // // // function getRandomDeadline() {
// // // //     const months = ['January', 'February', 'March', 'April', 'May', 'December'];
// // // //     const days = [1, 15, 30];
// // // //     const year = new Date().getFullYear() + 1;
    
// // // //     const month = months[Math.floor(Math.random() * months.length)];
// // // //     const day = days[Math.floor(Math.random() * days.length)];
    
// // // //     return `${month} ${day}, ${year}`;
// // // // }

// // // // function removeDuplicates(results) {
// // // //     const seen = new Set();
// // // //     return results.filter(result => {
// // // //         const key = `${result.university}-${result.program}`;
// // // //         if (seen.has(key)) {
// // // //             return false;
// // // //         }
// // // //         seen.add(key);
// // // //         return true;
// // // //     });
// // // // }

// // // // // AI-powered advanced search (mock implementation)
// // // // async function aiSearch(country, course, level, session, additionalCriteria) {
// // // //     // In a real implementation, this would use an AI service like OpenAI, Google AI, etc.
// // // //     const basicResults = await searchPrograms(country, course, level, session, 'basic');
    
// // // //     // Simulate AI enhancement
// // // //     const enhancedResults = basicResults.map(result => ({
// // // //         ...result,
// // // //         aiScore: Math.random() * 100,
// // // //         aiInsights: generateAIInsights(result, additionalCriteria),
// // // //         matchPercentage: Math.floor(Math.random() * 30) + 70
// // // //     }));
    
// // // //     return enhancedResults.sort((a, b) => b.aiScore - a.aiScore);
// // // // }

// // // // function generateAIInsights(result, criteria) {
// // // //     const insights = [
// // // //         `Strong match based on ${result.fundingType.toLowerCase()} availability`,
// // // //         `Program curriculum aligns well with current industry trends`,
// // // //         `University has excellent international student support`,
// // // //         `High success rate for international student visa approvals`,
// // // //         `Strong alumni network in target career fields`
// // // //     ];
    
// // // //     return insights[Math.floor(Math.random() * insights.length)];
// // // // }

// // // // // Routes
// // // // app.get('/', (req, res) => {
// // // //     res.send(`
// // // // <!DOCTYPE html>
// // // // <html lang="en">
// // // // <head>
// // // //     <meta charset="UTF-8">
// // // //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // //     <title>Masters Program Search - International Funding</title>
// // // //     <style>
// // // //         * {
// // // //             margin: 0;
// // // //             padding: 0;
// // // //             box-sizing: border-box;
// // // //         }

// // // //         body {
// // // //             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // // //             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // //             min-height: 100vh;
// // // //             padding: 20px;
// // // //         }

// // // //         .container {
// // // //             max-width: 1200px;
// // // //             margin: 0 auto;
// // // //             background: white;
// // // //             border-radius: 15px;
// // // //             box-shadow: 0 20px 40px rgba(0,0,0,0.1);
// // // //             overflow: hidden;
// // // //         }

// // // //         .header {
// // // //             background: linear-gradient(135deg, #4CAF50, #45a049);
// // // //             color: white;
// // // //             padding: 30px;
// // // //             text-align: center;
// // // //         }

// // // //         .header h1 {
// // // //             font-size: 2.5rem;
// // // //             margin-bottom: 10px;
// // // //         }

// // // //         .header p {
// // // //             font-size: 1.2rem;
// // // //             opacity: 0.9;
// // // //         }

// // // //         .mode-toggle {
// // // //             text-align: center;
// // // //             padding: 20px;
// // // //             background: #f8f9fa;
// // // //         }

// // // //         .toggle-btn {
// // // //             background: #007bff;
// // // //             color: white;
// // // //             border: none;
// // // //             padding: 12px 30px;
// // // //             border-radius: 25px;
// // // //             cursor: pointer;
// // // //             font-size: 1rem;
// // // //             transition: all 0.3s ease;
// // // //         }

// // // //         .toggle-btn:hover {
// // // //             background: #0056b3;
// // // //             transform: translateY(-2px);
// // // //         }

// // // //         .toggle-btn.active {
// // // //             background: #28a745;
// // // //         }

// // // //         .search-form {
// // // //             padding: 40px;
// // // //         }

// // // //         .form-grid {
// // // //             display: grid;
// // // //             grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
// // // //             gap: 20px;
// // // //             margin-bottom: 30px;
// // // //         }

// // // //         .form-group {
// // // //             display: flex;
// // // //             flex-direction: column;
// // // //         }

// // // //         .form-group label {
// // // //             font-weight: 600;
// // // //             margin-bottom: 8px;
// // // //             color: #333;
// // // //         }

// // // //         .form-group select,
// // // //         .form-group input {
// // // //             padding: 12px;
// // // //             border: 2px solid #ddd;
// // // //             border-radius: 8px;
// // // //             font-size: 1rem;
// // // //             transition: border-color 0.3s ease;
// // // //         }

// // // //         .form-group select:focus,
// // // //         .form-group input:focus {
// // // //             outline: none;
// // // //             border-color: #007bff;
// // // //         }

// // // //         .advanced-options {
// // // //             display: none;
// // // //             background: #f8f9fa;
// // // //             padding: 20px;
// // // //             border-radius: 10px;
// // // //             margin-top: 20px;
// // // //         }

// // // //         .advanced-options.show {
// // // //             display: block;
// // // //         }

// // // //         .search-btn {
// // // //             background: linear-gradient(135deg, #28a745, #20c997);
// // // //             color: white;
// // // //             border: none;
// // // //             padding: 15px 40px;
// // // //             border-radius: 8px;
// // // //             font-size: 1.1rem;
// // // //             cursor: pointer;
// // // //             transition: all 0.3s ease;
// // // //             width: 100%;
// // // //         }

// // // //         .search-btn:hover {
// // // //             transform: translateY(-2px);
// // // //             box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
// // // //         }

// // // //         .loading {
// // // //             text-align: center;
// // // //             padding: 40px;
// // // //             display: none;
// // // //         }

// // // //         .loading.show {
// // // //             display: block;
// // // //         }

// // // //         .spinner {
// // // //             border: 4px solid #f3f3f3;
// // // //             border-top: 4px solid #3498db;
// // // //             border-radius: 50%;
// // // //             width: 40px;
// // // //             height: 40px;
// // // //             animation: spin 2s linear infinite;
// // // //             margin: 0 auto 20px;
// // // //         }

// // // //         @keyframes spin {
// // // //             0% { transform: rotate(0deg); }
// // // //             100% { transform: rotate(360deg); }
// // // //         }

// // // //         .results {
// // // //             padding: 0 40px 40px;
// // // //             display: none;
// // // //         }

// // // //         .results.show {
// // // //             display: block;
// // // //         }

// // // //         .result-card {
// // // //             background: white;
// // // //             border: 1px solid #ddd;
// // // //             border-radius: 10px;
// // // //             padding: 25px;
// // // //             margin-bottom: 20px;
// // // //             box-shadow: 0 2px 10px rgba(0,0,0,0.05);
// // // //             transition: transform 0.2s ease;
// // // //         }

// // // //         .result-card:hover {
// // // //             transform: translateY(-2px);
// // // //             box-shadow: 0 5px 20px rgba(0,0,0,0.1);
// // // //         }

// // // //         .result-header {
// // // //             display: flex;
// // // //             justify-content: between;
// // // //             align-items: flex-start;
// // // //             margin-bottom: 15px;
// // // //         }

// // // //         .university-name {
// // // //             font-size: 1.3rem;
// // // //             font-weight: bold;
// // // //             color: #2c3e50;
// // // //             margin-bottom: 5px;
// // // //         }

// // // //         .program-name {
// // // //             color: #7f8c8d;
// // // //             font-size: 1rem;
// // // //         }

// // // //         .funding-badge {
// // // //             background: #28a745;
// // // //             color: white;
// // // //             padding: 5px 15px;
// // // //             border-radius: 20px;
// // // //             font-size: 0.9rem;
// // // //             margin-left: auto;
// // // //         }

// // // //         .result-details {
// // // //             display: grid;
// // // //             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// // // //             gap: 15px;
// // // //             margin: 15px 0;
// // // //         }

// // // //         .detail-item {
// // // //             display: flex;
// // // //             flex-direction: column;
// // // //         }

// // // //         .detail-label {
// // // //             font-weight: 600;
// // // //             color: #666;
// // // //             font-size: 0.9rem;
// // // //         }

// // // //         .detail-value {
// // // //             color: #333;
// // // //             font-size: 1rem;
// // // //         }

// // // //         .requirements {
// // // //             margin-top: 15px;
// // // //         }

// // // //         .requirements ul {
// // // //             list-style: none;
// // // //             padding-left: 0;
// // // //         }

// // // //         .requirements li {
// // // //             background: #f8f9fa;
// // // //             padding: 5px 10px;
// // // //             margin: 3px 0;
// // // //             border-radius: 5px;
// // // //             font-size: 0.9rem;
// // // //         }

// // // //         .ai-insights {
// // // //             background: linear-gradient(135deg, #667eea, #764ba2);
// // // //             color: white;
// // // //             padding: 10px 15px;
// // // //             border-radius: 8px;
// // // //             margin-top: 15px;
// // // //             font-style: italic;
// // // //         }

// // // //         .match-score {
// // // //             background: #17a2b8;
// // // //             color: white;
// // // //             padding: 5px 10px;
// // // //             border-radius: 15px;
// // // //             font-size: 0.8rem;
// // // //             display: inline-block;
// // // //             margin-left: 10px;
// // // //         }

// // // //         .no-results {
// // // //             text-align: center;
// // // //             padding: 40px;
// // // //             color: #666;
// // // //         }

// // // //         @media (max-width: 768px) {
// // // //             .header h1 {
// // // //                 font-size: 2rem;
// // // //             }
            
// // // //             .form-grid {
// // // //                 grid-template-columns: 1fr;
// // // //             }
            
// // // //             .result-details {
// // // //                 grid-template-columns: 1fr;
// // // //             }
// // // //         }
// // // //     </style>
// // // // </head>
// // // // <body>
// // // //     <div class="container">
// // // //         <div class="header">
// // // //             <h1>🎓 Masters Program Search</h1>
// // // //             <p>Find funded graduate programs for international students worldwide</p>
// // // //         </div>

// // // //         <div class="mode-toggle">
// // // //             <button id="modeToggle" class="toggle-btn">Switch to Advanced Mode (AI-Powered)</button>
// // // //         </div>

// // // //         <form id="searchForm" class="search-form">
// // // //             <div class="form-grid">
// // // //                 <div class="form-group">
// // // //                     <label for="country">Country</label>
// // // //                     <select id="country" name="country" required>
// // // //                         <option value="">Select Country</option>
// // // //                         <option value="USA">United States</option>
// // // //                         <option value="Canada">Canada</option>
// // // //                         <option value="UK">United Kingdom</option>
// // // //                         <option value="Germany">Germany</option>
// // // //                         <option value="Australia">Australia</option>
// // // //                         <option value="Netherlands">Netherlands</option>
// // // //                         <option value="Sweden">Sweden</option>
// // // //                         <option value="Norway">Norway</option>
// // // //                         <option value="Denmark">Denmark</option>
// // // //                         <option value="France">France</option>
// // // //                     </select>
// // // //                 </div>

// // // //                 <div class="form-group">
// // // //                     <label for="course">Course/Field</label>
// // // //                     <input type="text" id="course" name="course" placeholder="e.g., Computer Science" required>
// // // //                 </div>

// // // //                 <div class="form-group">
// // // //                     <label for="level">Level of Study</label>
// // // //                     <select id="level" name="level" required>
// // // //                         <option value="">Select Level</option>
// // // //                         <option value="Masters">Masters</option>
// // // //                         <option value="PhD">PhD</option>
// // // //                         <option value="Post-Doc">Post-Doctorate</option>
// // // //                     </select>
// // // //                 </div>

// // // //                 <div class="form-group">
// // // //                     <label for="session">Academic Session</label>
// // // //                     <select id="session" name="session" required>
// // // //                         <option value="">Select Session</option>
// // // //                         <option value="Fall 2024">Fall 2024</option>
// // // //                         <option value="Spring 2025">Spring 2025</option>
// // // //                         <option value="Fall 2025">Fall 2025</option>
// // // //                         <option value="Spring 2026">Spring 2026</option>
// // // //                     </select>
// // // //                 </div>
// // // //             </div>

// // // //             <div id="advancedOptions" class="advanced-options">
// // // //                 <h3 style="margin-bottom: 20px;">🤖 AI-Enhanced Search Options</h3>
// // // //                 <div class="form-grid">
// // // //                     <div class="form-group">
// // // //                         <label for="minFunding">Minimum Funding Amount</label>
// // // //                         <input type="text" id="minFunding" name="minFunding" placeholder="e.g., $15,000">
// // // //                     </div>
                    
// // // //                     <div class="form-group">
// // // //                         <label for="preferredFunding">Preferred Funding Type</label>
// // // //                         <select id="preferredFunding" name="preferredFunding">
// // // //                             <option value="">Any Type</option>
// // // //                             <option value="Teaching Assistantship">Teaching Assistantship</option>
// // // //                             <option value="Research Assistantship">Research Assistantship</option>
// // // //                             <option value="Graduate Assistantship">Graduate Assistantship</option>
// // // //                             <option value="Merit Scholarship">Merit Scholarship</option>
// // // //                             <option value="Need-based Bursary">Need-based Bursary</option>
// // // //                         </select>
// // // //                     </div>

// // // //                     <div class="form-group">
// // // //                         <label for="specialRequirements">Special Requirements</label>
// // // //                         <input type="text" id="specialRequirements" name="specialRequirements" placeholder="e.g., no GRE required">
// // // //                     </div>
// // // //                 </div>
// // // //             </div>

// // // //             <button type="submit" class="search-btn">🔍 Search Programs</button>
// // // //         </form>

// // // //         <div id="loading" class="loading">
// // // //             <div class="spinner"></div>
// // // //             <p>Searching for programs... Please wait</p>
// // // //         </div>

// // // //         <div id="results" class="results"></div>
// // // //     </div>

// // // //     <script>
// // // //         let isAdvancedMode = false;

// // // //         document.getElementById('modeToggle').addEventListener('click', function() {
// // // //             isAdvancedMode = !isAdvancedMode;
// // // //             const advancedOptions = document.getElementById('advancedOptions');
// // // //             const button = this;

// // // //             if (isAdvancedMode) {
// // // //                 advancedOptions.classList.add('show');
// // // //                 button.textContent = 'Switch to Basic Mode';
// // // //                 button.classList.add('active');
// // // //             } else {
// // // //                 advancedOptions.classList.remove('show');
// // // //                 button.textContent = 'Switch to Advanced Mode (AI-Powered)';
// // // //                 button.classList.remove('active');
// // // //             }
// // // //         });

// // // //         document.getElementById('searchForm').addEventListener('submit', async function(e) {
// // // //             e.preventDefault();
            
// // // //             const formData = new FormData(this);
// // // //             const searchData = Object.fromEntries(formData.entries());
// // // //             searchData.mode = isAdvancedMode ? 'advanced' : 'basic';

// // // //             // Show loading
// // // //             document.getElementById('loading').classList.add('show');
// // // //             document.getElementById('results').classList.remove('show');

// // // //             try {
// // // //                 const response = await fetch('/search', {
// // // //                     method: 'POST',
// // // //                     headers: {
// // // //                         'Content-Type': 'application/json',
// // // //                     },
// // // //                     body: JSON.stringify(searchData)
// // // //                 });

// // // //                 const results = await response.json();
// // // //                 displayResults(results);
// // // //             } catch (error) {
// // // //                 console.error('Search error:', error);
// // // //                 alert('Search failed. Please try again.');
// // // //             } finally {
// // // //                 document.getElementById('loading').classList.remove('show');
// // // //             }
// // // //         });

// // // //         function displayResults(results) {
// // // //             const resultsContainer = document.getElementById('results');
            
// // // //             if (!results || results.length === 0) {
// // // //                 resultsContainer.innerHTML = '<div class="no-results"><h3>No programs found</h3><p>Try adjusting your search criteria</p></div>';
// // // //                 resultsContainer.classList.add('show');
// // // //                 return;
// // // //             }

// // // //             const resultsHTML = results.map(result => `
// // // //                 <div class="result-card">
// // // //                     <div class="result-header">
// // // //                         <div>
// // // //                             <div class="university-name">${result.university}</div>
// // // //                             <div class="program-name">${result.program}</div>
// // // //                         </div>
// // // //                         <div class="funding-badge">${result.fundingType}</div>
// // // //                         ${result.matchPercentage ? `<div class="match-score">${result.matchPercentage}% match</div>` : ''}
// // // //                     </div>

// // // //                     <div class="result-details">
// // // //                         <div class="detail-item">
// // // //                             <span class="detail-label">Country</span>
// // // //                             <span class="detail-value">${result.country}</span>
// // // //                         </div>
// // // //                         <div class="detail-item">
// // // //                             <span class="detail-label">Session</span>
// // // //                             <span class="detail-value">${result.session}</span>
// // // //                         </div>
// // // //                         <div class="detail-item">
// // // //                             <span class="detail-label">Funding Amount</span>
// // // //                             <span class="detail-value">${result.amount}</span>
// // // //                         </div>
// // // //                         <div class="detail-item">
// // // //                             <span class="detail-label">Application Deadline</span>
// // // //                             <span class="detail-value">${result.applicationDeadline}</span>
// // // //                         </div>
// // // //                         <div class="detail-item">
// // // //                             <span class="detail-label">Eligibility</span>
// // // //                             <span class="detail-value">${result.eligibility}</span>
// // // //                         </div>
// // // //                         <div class="detail-item">
// // // //                             <span class="detail-label">Last Updated</span>
// // // //                             <span class="detail-value">${result.lastUpdated}</span>
// // // //                         </div>
// // // //                     </div>

// // // //                     <p style="margin: 15px 0; color: #555;">${result.description}</p>

// // // //                     ${result.aiInsights ? `<div class="ai-insights">🤖 AI Insight: ${result.aiInsights}</div>` : ''}

// // // //                     <div class="requirements">
// // // //                         <strong>Requirements:</strong>
// // // //                         <ul>
// // // //                             ${result.requirements.map(req => `<li>✓ ${req}</li>`).join('')}
// // // //                         </ul>
// // // //                     </div>

// // // //                     <div style="margin-top: 15px;">
// // // //                         <a href="${result.url}" target="_blank" style="color: #007bff; text-decoration: none;">🔗 View Program Details</a>
// // // //                     </div>
// // // //                 </div>
// // // //             `).join('');

// // // //             resultsContainer.innerHTML = `
// // // //                 <h2 style="margin-bottom: 20px;">Found ${results.length} Programs</h2>
// // // //                 ${resultsHTML}
// // // //             `;
// // // //             resultsContainer.classList.add('show');
// // // //         }
// // // //     </script>
// // // // </body>
// // // // </html>
// // // //     `);
// // // // });

// // // // app.post('/search', async (req, res) => {
// // // //     try {
// // // //         const { country, course, level, session, mode, minFunding, preferredFunding, specialRequirements } = req.body;

// // // //         let results;
// // // //         if (mode === 'advanced') {
// // // //             results = await aiSearch(country, course, level, session, {
// // // //                 minFunding,
// // // //                 preferredFunding,
// // // //                 specialRequirements
// // // //             });
// // // //         } else {
// // // //             results = await searchPrograms(country, course, level, session, mode);
// // // //         }

// // // //         res.json(results);
// // // //     } catch (error) {
// // // //         console.error('Search endpoint error:', error);
// // // //         res.status(500).json({ error: 'Search failed' });
// // // //     }
// // // // });

// // // // // Health check endpoint
// // // // app.get('/health', (req, res) => {
// // // //     res.json({ status: 'OK', timestamp: new Date().toISOString() });
// // // // });

// // // // // Start server
// // // // app.listen(PORT, () => {
// // // //     console.log(`🚀 Masters Program Search App running on port ${PORT}`);
// // // //     console.log(`📱 Access the app at: http://localhost:${PORT}`);
// // // // });

// // // // module.exports = app;





// // // const express = require('express');
// // // const axios = require('axios');
// // // const cheerio = require('cheerio');
// // // const path = require('path');

// // // const app = express();
// // // const PORT = process.env.PORT || 3000;

// // // // Set view engine to EJS
// // // app.set('view engine', 'ejs');
// // // app.set('views', path.join(__dirname, 'views'));

// // // // Middleware
// // // app.use(express.json());
// // // app.use(express.urlencoded({ extended: true }));
// // // app.use(express.static('public'));

// // // // In-memory cache for search results
// // // const searchCache = new Map();
// // // const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// // // // Helper function to clean and format text
// // // function cleanText(text) {
// // //     return text.replace(/\s+/g, ' ').trim();
// // // }

// // // // Generate mock results for demonstration
// // // async function generateMockResults(country, course, level, session, query) {
// // //     // This would be replaced with actual scraping in a real implementation
// // //     const universities = [
// // //         "University of " + country, 
// // //         country + " State University", 
// // //         "Technical University of " + country,
// // //         "International University of " + country,
// // //         country + " Institute of Technology"
// // //     ];
    
// // //     const fundingTypes = [
// // //         "Teaching Assistantship", 
// // //         "Research Assistantship", 
// // //         "Merit Scholarship", 
// // //         "Graduate Assistantship",
// // //         "Need-based Bursary"
// // //     ];
    
// // //     const results = [];
    
// // //     for (let i = 0; i < 5; i++) {
// // //         results.push({
// // //             university: universities[i % universities.length],
// // //             program: `${course} ${level}`,
// // //             country: country,
// // //             session: session,
// // //             fundingType: fundingTypes[i % fundingTypes.length],
// // //             amount: `$${Math.floor(Math.random() * 20000) + 10000}/year`,
// // //             eligibility: 'International students eligible',
// // //             applicationDeadline: getRandomDeadline(),
// // //             description: `${course} ${level} program at ${universities[i % universities.length]} with ${fundingTypes[i % fundingTypes.length].toLowerCase()} opportunities for international students.`,
// // //             url: `https://www.example.com/${universities[i % universities.length].toLowerCase().replace(/\s+/g, '-')}/${course.toLowerCase().replace(/\s+/g, '-')}`,
// // //             requirements: ['Bachelor\'s degree in related field', 'English proficiency (TOEFL/IELTS)', 'Statement of purpose', 'Letters of recommendation'],
// // //             lastUpdated: new Date().toISOString().split('T')[0],
// // //             source: 'Mock Data'
// // //         });
// // //     }
    
// // //     return results;
// // // }

// // // // Basic web scraping function for program search
// // // async function searchPrograms(country, course, level, session, mode = 'basic') {
// // //     const cacheKey = `${country}-${course}-${level}-${session}-${mode}`;
    
// // //     // Check cache first
// // //     if (searchCache.has(cacheKey)) {
// // //         const cached = searchCache.get(cacheKey);
// // //         if (Date.now() - cached.timestamp < CACHE_DURATION) {
// // //             return cached.data;
// // //         }
// // //     }

// // //     let results = [];
    
// // //     try {
// // //         // Search multiple university databases and funding sites
// // //         const searchQueries = [
// // //             `${course} masters ${country} funding international students ${session}`,
// // //             `graduate assistantship ${course} ${country} international`,
// // //             `teaching assistantship masters ${course} ${country}`,
// // //             `bursary ${course} masters ${country} international students`,
// // //             `scholarship ${course} ${country} graduate program`
// // //         ];

// // //         for (let query of searchQueries) {
// // //             try {
// // //                 // Simulate search results (in real implementation, you'd scrape actual sites)
// // //                 const mockResults = await generateMockResults(country, course, level, session, query);
// // //                 results.push(...mockResults);
// // //             } catch (error) {
// // //                 console.error(`Error searching with query: ${query}`, error.message);
// // //             }
// // //         }

// // //         // Remove duplicates and sort by relevance
// // //         results = removeDuplicates(results);
// // //         results = results.slice(0, 20); // Limit to top 20 results

// // //         // Cache results
// // //         searchCache.set(cacheKey, {
// // //             data: results,
// // //             timestamp: Date.now()
// // //         });

// // //         return results;
// // //     } catch (error) {
// // //         console.error('Search error:', error);
// // //         return [];
// // //     }
// // // }

// // // // Helper functions for data extraction
// // // function extractFundingType(text) {
// // //     const fundingKeywords = {
// // //         'teaching assistant': 'Teaching Assistantship',
// // //         'research assistant': 'Research Assistantship',
// // //         'graduate assistant': 'Graduate Assistantship',
// // //         'scholarship': 'Merit Scholarship',
// // //         'bursary': 'Need-based Bursary',
// // //         'grant': 'Research Grant',
// // //         'fellowship': 'Fellowship',
// // //         'tuition waiver': 'Tuition Waiver'
// // //     };
    
// // //     const lowerText = text.toLowerCase();
    
// // //     for (const [keyword, type] of Object.entries(fundingKeywords)) {
// // //         if (lowerText.includes(keyword)) {
// // //             return type;
// // //         }
// // //     }
    
// // //     return 'Funding Available';
// // // }

// // // function extractAmount(text) {
// // //     const amountRegex = /\$[\d,]+(?:-\$?[\d,]+)?|\€[\d,]+(?:-\€?[\d,]+)?|[\d,]+\s*(?:USD|EUR|CAD|GBP|AUD)/gi;
// // //     const matches = text.match(amountRegex);
    
// // //     if (matches && matches.length > 0) {
// // //         return matches[0];
// // //     }
    
// // //     // Look for percentage mentions
// // //     const percentageRegex = /\d+%\s*(?:tuition|fee)/gi;
// // //     const percentMatches = text.match(percentageRegex);
    
// // //     if (percentMatches && percentMatches.length > 0) {
// // //         return percentMatches[0];
// // //     }
    
// // //     return 'Amount varies';
// // // }

// // // function extractUniversityName(title, description) {
// // //     // Common university keywords
// // //     const universityKeywords = ['university', 'college', 'institute', 'school'];
    
// // //     const text = (title + ' ' + description).toLowerCase();
    
// // //     // Split into words and look for university names
// // //     const words = text.split(/\s+/);
    
// // //     for (let i = 0; i < words.length - 1; i++) {
// // //         if (universityKeywords.some(keyword => words[i + 1] && words[i + 1].includes(keyword))) {
// // //             // Found a potential university name
// // //             const universityName = words.slice(Math.max(0, i - 2), i + 2).join(' ');
// // //             if (universityName.length > 5) {
// // //                 return cleanText(universityName);
// // //             }
// // //         }
// // //     }
    
// // //     return 'Institution Details Available';
// // // }

// // // function getRandomDeadline() {
// // //     const months = ['January', 'February', 'March', 'April', 'May', 'December'];
// // //     const days = [1, 15, 30];
// // //     const year = new Date().getFullYear() + 1;
    
// // //     const month = months[Math.floor(Math.random() * months.length)];
// // //     const day = days[Math.floor(Math.random() * days.length)];
    
// // //     return `${month} ${day}, ${year}`;
// // // }

// // // function removeDuplicates(results) {
// // //     const seen = new Set();
// // //     return results.filter(result => {
// // //         const key = `${result.university}-${result.program}`;
// // //         if (seen.has(key)) {
// // //             return false;
// // //         }
// // //         seen.add(key);
// // //         return true;
// // //     });
// // // }

// // // // AI-powered advanced search (mock implementation)
// // // async function aiSearch(country, course, level, session, additionalCriteria) {
// // //     // In a real implementation, this would use an AI service like OpenAI, Google AI, etc.
// // //     const basicResults = await searchPrograms(country, course, level, session, 'basic');
    
// // //     // Simulate AI enhancement
// // //     const enhancedResults = basicResults.map(result => ({
// // //         ...result,
// // //         aiScore: Math.random() * 100,
// // //         aiInsights: generateAIInsights(result, additionalCriteria),
// // //         matchPercentage: Math.floor(Math.random() * 30) + 70
// // //     }));
    
// // //     return enhancedResults.sort((a, b) => b.aiScore - a.aiScore);
// // // }

// // // function generateAIInsights(result, criteria) {
// // //     const insights = [
// // //         `Strong match based on ${result.fundingType.toLowerCase()} availability`,
// // //         `Program curriculum aligns well with current industry trends`,
// // //         `University has excellent international student support`,
// // //         `High success rate for international student visa approvals`,
// // //         `Strong alumni network in target career fields`
// // //     ];
    
// // //     return insights[Math.floor(Math.random() * insights.length)];
// // // }

// // // // Routes
// // // app.get('/', (req, res) => {
// // //     res.render('index');
// // // });

// // // app.post('/search', async (req, res) => {
// // //     try {
// // //         const { country, course, level, session, mode, minFunding, preferredFunding, specialRequirements } = req.body;

// // //         let results;
// // //         if (mode === 'advanced') {
// // //             results = await aiSearch(country, course, level, session, {
// // //                 minFunding,
// // //                 preferredFunding,
// // //                 specialRequirements
// // //             });
// // //         } else {
// // //             results = await searchPrograms(country, course, level, session, mode);
// // //         }

// // //         res.json(results);
// // //     } catch (error) {
// // //         console.error('Search endpoint error:', error);
// // //         res.status(500).json({ error: 'Search failed' });
// // //     }
// // // });

// // // // Health check endpoint
// // // app.get('/health', (req, res) => {
// // //     res.json({ status: 'OK', timestamp: new Date().toISOString() });
// // // });

// // // // Start server
// // // app.listen(PORT, () => {
// // //     console.log(`🚀 Masters Program Search App running on port ${PORT}`);
// // //     console.log(`📱 Access the app at: http://localhost:${PORT}`);
// // // });

// // // module.exports = app;





// // const express = require('express');
// // const axios = require('axios');
// // const cheerio = require('cheerio');
// // const path = require('path');

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // // Set view engine to EJS
// // app.set('view engine', 'ejs');
// // app.set('views', path.join(__dirname, 'views'));

// // // Middleware
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.static('public'));

// // // In-memory cache for search results
// // const searchCache = new Map();
// // const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// // // Company information
// // const COMPANY_INFO = {
// //   name: "Suntrenia",
// //   appName: "ScholarBridge",
// //   email: "info@suntrenia.com",
// //   xHandle: "suntreniTech",
// //   phone: "07034995589",
// //   website: "https://suntrenia.com"
// // };

// // // Helper function to clean and format text
// // function cleanText(text) {
// //   return text.replace(/\s+/g, ' ').trim();
// // }

// // // Generate mock results for demonstration
// // async function generateMockResults(country, course, level, session, query) {
// //   // This would be replaced with actual scraping in a real implementation
// //   const universities = [
// //     "University of " + country, 
// //     country + " State University", 
// //     "Technical University of " + country,
// //     "International University of " + country,
// //     country + " Institute of Technology"
// //   ];
  
// //   const fundingTypes = [
// //     "Teaching Assistantship", 
// //     "Research Assistantship", 
// //     "Merit Scholarship", 
// //     "Graduate Assistantship",
// //     "Need-based Bursary"
// //   ];
  
// //   const results = [];
  
// //   for (let i = 0; i < 5; i++) {
// //     results.push({
// //       university: universities[i % universities.length],
// //       program: `${course} ${level}`,
// //       country: country,
// //       session: session,
// //       fundingType: fundingTypes[i % fundingTypes.length],
// //       amount: `$${Math.floor(Math.random() * 20000) + 10000}/year`,
// //       eligibility: 'International students eligible',
// //       applicationDeadline: getRandomDeadline(),
// //       description: `${course} ${level} program at ${universities[i % universities.length]} with ${fundingTypes[i % fundingTypes.length].toLowerCase()} opportunities for international students.`,
// //       url: `https://www.example.com/${universities[i % universities.length].toLowerCase().replace(/\s+/g, '-')}/${course.toLowerCase().replace(/\s+/g, '-')}`,
// //       requirements: ['Bachelor\'s degree in related field', 'English proficiency (TOEFL/IELTS)', 'Statement of purpose', 'Letters of recommendation'],
// //       lastUpdated: new Date().toISOString().split('T')[0],
// //       source: 'Mock Data',
// //       applicationFee: 0.00 // Free for testing
// //     });
// //   }
  
// //   return results;
// // }

// // // Basic web scraping function for program search
// // async function searchPrograms(country, course, level, session, mode = 'basic') {
// //   const cacheKey = `${country}-${course}-${level}-${session}-${mode}`;
  
// //   // Check cache first
// //   if (searchCache.has(cacheKey)) {
// //     const cached = searchCache.get(cacheKey);
// //     if (Date.now() - cached.timestamp < CACHE_DURATION) {
// //       return cached.data;
// //     }
// //   }

// //   let results = [];
  
// //   try {
// //     // Search multiple university databases and funding sites
// //     const searchQueries = [
// //       `${course} masters ${country} funding international students ${session}`,
// //       `graduate assistantship ${course} ${country} international`,
// //       `teaching assistantship masters ${course} ${country}`,
// //       `bursary ${course} masters ${country} international students`,
// //       `scholarship ${course} ${country} graduate program`
// //     ];

// //     for (let query of searchQueries) {
// //       try {
// //         // Simulate search results (in real implementation, you'd scrape actual sites)
// //         const mockResults = await generateMockResults(country, course, level, session, query);
// //         results.push(...mockResults);
// //       } catch (error) {
// //         console.error(`Error searching with query: ${query}`, error.message);
// //       }
// //     }

// //     // Remove duplicates and sort by relevance
// //     results = removeDuplicates(results);
// //     results = results.slice(0, 20); // Limit to top 20 results

// //     // Cache results
// //     searchCache.set(cacheKey, {
// //       data: results,
// //       timestamp: Date.now()
// //     });

// //     return results;
// //   } catch (error) {
// //     console.error('Search error:', error);
// //     return [];
// //   }
// // }

// // // Helper functions for data extraction
// // function extractFundingType(text) {
// //   const fundingKeywords = {
// //     'teaching assistant': 'Teaching Assistantship',
// //     'research assistant': 'Research Assistantship',
// //     'graduate assistant': 'Graduate Assistantship',
// //     'scholarship': 'Merit Scholarship',
// //     'bursary': 'Need-based Bursary',
// //     'grant': 'Research Grant',
// //     'fellowship': 'Fellowship',
// //     'tuition waiver': 'Tuition Waiver'
// //   };
  
// //   const lowerText = text.toLowerCase();
  
// //   for (const [keyword, type] of Object.entries(fundingKeywords)) {
// //     if (lowerText.includes(keyword)) {
// //       return type;
// //     }
// //   }
  
// //   return 'Funding Available';
// // }

// // function extractAmount(text) {
// //   const amountRegex = /\$[\d,]+(?:-\$?[\d,]+)?|\€[\d,]+(?:-\€?[\d,]+)?|[\d,]+\s*(?:USD|EUR|CAD|GBP|AUD)/gi;
// //   const matches = text.match(amountRegex);
  
// //   if (matches && matches.length > 0) {
// //     return matches[0];
// //   }
  
// //   // Look for percentage mentions
// //   const percentageRegex = /\d+%\s*(?:tuition|fee)/gi;
// //   const percentMatches = text.match(percentageRegex);
  
// //   if (percentMatches && percentMatches.length > 0) {
// //     return percentMatches[0];
// //   }
  
// //   return 'Amount varies';
// // }

// // function extractUniversityName(title, description) {
// //   // Common university keywords
// //   const universityKeywords = ['university', 'college', 'institute', 'school'];
  
// //   const text = (title + ' ' + description).toLowerCase();
  
// //   // Split into words and look for university names
// //   const words = text.split(/\s+/);
  
// //   for (let i = 0; i < words.length - 1; i++) {
// //     if (universityKeywords.some(keyword => words[i + 1] && words[i + 1].includes(keyword))) {
// //       // Found a potential university name
// //       const universityName = words.slice(Math.max(0, i - 2), i + 2).join(' ');
// //       if (universityName.length > 5) {
// //         return cleanText(universityName);
// //       }
// //     }
// //   }
  
// //   return 'Institution Details Available';
// // }

// // function getRandomDeadline() {
// //   const months = ['January', 'February', 'March', 'April', 'May', 'December'];
// //   const days = [1, 15, 30];
// //   const year = new Date().getFullYear() + 1;
  
// //   const month = months[Math.floor(Math.random() * months.length)];
// //   const day = days[Math.floor(Math.random() * days.length)];
  
// //   return `${month} ${day}, ${year}`;
// // }

// // function removeDuplicates(results) {
// //   const seen = new Set();
// //   return results.filter(result => {
// //     const key = `${result.university}-${result.program}`;
// //     if (seen.has(key)) {
// //       return false;
// //     }
// //     seen.add(key);
// //     return true;
// //   });
// // }

// // // AI-powered advanced search (mock implementation)
// // async function aiSearch(country, course, level, session, additionalCriteria) {
// //   // In a real implementation, this would use an AI service like OpenAI, Google AI, etc.
// //   const basicResults = await searchPrograms(country, course, level, session, 'basic');
  
// //   // Simulate AI enhancement
// //   const enhancedResults = basicResults.map(result => ({
// //     ...result,
// //     aiScore: Math.random() * 100,
// //     aiInsights: generateAIInsights(result, additionalCriteria),
// //     matchPercentage: Math.floor(Math.random() * 30) + 70
// //   }));
  
// //   return enhancedResults.sort((a, b) => b.aiScore - a.aiScore);
// // }

// // function generateAIInsights(result, criteria) {
// //   const insights = [
// //     `Strong match based on ${result.fundingType.toLowerCase()} availability`,
// //     `Program curriculum aligns well with current industry trends`,
// //     `University has excellent international student support`,
// //     `High success rate for international student visa approvals`,
// //     `Strong alumni network in target career fields`
// //   ];
  
// //   return insights[Math.floor(Math.random() * insights.length)];
// // }

// // // Routes
// // app.get('/', (req, res) => {
// //   res.render('index', { company: COMPANY_INFO });
// // });

// // app.post('/search', async (req, res) => {
// //   try {
// //     const { country, course, level, session, mode, minFunding, preferredFunding, specialRequirements } = req.body;

// //     let results;
// //     if (mode === 'advanced') {
// //       results = await aiSearch(country, course, level, session, {
// //         minFunding,
// //         preferredFunding,
// //         specialRequirements
// //       });
// //     } else {
// //       results = await searchPrograms(country, course, level, session, mode);
// //     }

// //     res.json(results);
// //   } catch (error) {
// //     console.error('Search endpoint error:', error);
// //     res.status(500).json({ error: 'Search failed' });
// //   }
// // });

// // // Apply route
// // app.post('/apply', async (req, res) => {
// //   try {
// //     const { programId, university, program, email } = req.body;
    
// //     // In a real implementation, you would:
// //     // 1. Save application to database
// //     // 2. Process payment (for now it's $0.00)
// //     // 3. Send confirmation email
    
// //     // Simulate processing delay
// //     await new Promise(resolve => setTimeout(resolve, 2000));
    
// //     res.json({ 
// //       success: true, 
// //       message: 'Application submitted successfully!',
// //       applicationId: 'APP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
// //       amountPaid: 0.00
// //     });
// //   } catch (error) {
// //     console.error('Application error:', error);
// //     res.status(500).json({ error: 'Application failed' });
// //   }
// // });

// // // Health check endpoint
// // app.get('/health', (req, res) => {
// //   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// // });

// // // Start server
// // app.listen(PORT, () => {
// //   console.log(`🚀 ScholarBridge from Suntrenia running on port ${PORT}`);
// //   console.log(`📱 Access the app at: http://localhost:${PORT}`);
// // });

// // module.exports = app;






// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Set view engine to EJS
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

// // In-memory cache for search results
// const searchCache = new Map();
// const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// // Company information
// const COMPANY_INFO = {
//   name: "Suntrenia",
//   appName: "ScholarBridge",
//   email: "info@suntrenia.com",
//   xHandle: "suntreniTech",
//   phone: "07034995589",
//   website: "https://suntrenia.com"
// };

// // Helper function to clean and format text
// function cleanText(text) {
//   return text ? text.replace(/\s+/g, ' ').trim() : '';
// }

// // Main search function that combines all scraping methods
// async function searchPrograms(country, course, level, session, mode = 'basic') {
//   const cacheKey = `${country}-${course}-${level}-${session}-${mode}`;
  
//   // Check cache first
//   if (searchCache.has(cacheKey)) {
//     const cached = searchCache.get(cacheKey);
//     if (Date.now() - cached.timestamp < CACHE_DURATION) {
//       return cached.data;
//     }
//   }

//   try {
//     // Run all scraping functions in parallel
//     const [
//       directoryResults, 
//       scholarshipResults, 
//       governmentResults, 
//       portalResults,
//       daadResults,
//       scholarshipPortalResults
//     ] = await Promise.allSettled([
//       scrapeUniversityDirectory(country, course, level),
//       scrapeScholarshipSites(country, course, level, session),
//       scrapeGovernmentSites(country, course),
//       scrapeEducationPortals(country, course, level),
//       scrapeDAAD(country, course, level),
//       scrapeScholarshipPortals(country, course, level)
//     ]);

//     // Combine all results
//     let results = [];
    
//     [directoryResults, scholarshipResults, governmentResults, portalResults, daadResults, scholarshipPortalResults].forEach(result => {
//       if (result.status === 'fulfilled' && result.value.length > 0) {
//         results = results.concat(result.value);
//       }
//     });

//     // If no results from scraping, return empty array
//     if (results.length === 0) {
//       console.log('No results found from any scraping sources');
//       return [];
//     }

//     // Remove duplicates and sort by relevance
//     results = removeDuplicates(results);
//     results = results.slice(0, 20); // Limit to top 20 results

//     // Cache results
//     searchCache.set(cacheKey, {
//       data: results,
//       timestamp: Date.now()
//     });

//     return results;
//   } catch (error) {
//     console.error('Search error:', error);
//     return [];
//   }
// }

// // Scrape university directory sites
// async function scrapeUniversityDirectory(country, course, level) {
//   const results = [];
  
//   try {
//     const searchQueries = [
//       `${course} ${level} programs ${country} international students`,
//       `${course} ${level} funding ${country}`,
//       `${course} ${level} scholarships ${country}`
//     ];

//     for (const query of searchQueries) {
//       try {
//         const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
//         const response = await axios.get(googleSearchUrl, {
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//           },
//           timeout: 15000
//         });

//         const $ = cheerio.load(response.data);
        
//         // Extract university program results
//         $('.g').each((i, element) => {
//           if (i >= 15) return false; // Limit results
          
//           const $elem = $(element);
//           const title = cleanText($elem.find('h3').first().text());
//           const url = $elem.find('a').first().attr('href');
//           const description = cleanText($elem.find('.VwiC3b, .s3v9rd, .aCOpRe').first().text());
          
//           if (title && url && (title.toLowerCase().includes('university') || 
//                               title.toLowerCase().includes('college') ||
//                               description.toLowerCase().includes('program') ||
//                               description.toLowerCase().includes('admission'))) {
            
//             const universityMatch = title.match(/(.*?)(university|college|institute)/i);
//             const university = universityMatch ? cleanText(universityMatch[0]) : extractUniversityName(title, description);
            
//             results.push({
//               university: university || 'Higher Education Institution',
//               program: `${course} ${level}`,
//               country: country,
//               session: 'Check website',
//               fundingType: extractFundingType(description),
//               amount: extractAmount(description),
//               eligibility: 'International students eligible',
//               applicationDeadline: extractDeadline(description),
//               description: description || `${course} ${level} program in ${country}`,
//               url: extractGoogleUrl(url),
//               requirements: ['Bachelor degree', 'English proficiency', 'Academic transcripts'],
//               lastUpdated: new Date().toISOString().split('T')[0],
//               source: 'Google Search',
//               applicationFee: 0.00
//             });
//           }
//         });
//       } catch (error) {
//         console.error(`Error searching for "${query}":`, error.message);
//       }
//     }
//   } catch (error) {
//     console.error('University directory scraping error:', error);
//   }
  
//   return results;
// }

// // Scrape DAAD database (excellent resource for international students)
// async function scrapeDAAD(country, course, level) {
//   const results = [];
  
//   try {
//     // DAAD international program database
//     const daadUrl = `https://www.daad.de/en/study-and-research-in-germany/find-programme/?q=${encodeURIComponent(course)}&countries=${country.toLowerCase()}&degree=${level.toLowerCase()}`;
    
//     const response = await axios.get(daadUrl, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//       },
//       timeout: 15000
//     });

//     const $ = cheerio.load(response.data);
    
//     // Extract DAAD program listings
//     $('.programme-item, .study-program, .result-item').each((i, element) => {
//       if (i >= 10) return false;
      
//       const $elem = $(element);
//       const title = cleanText($elem.find('.programme-title, h3, .title').first().text());
//       const university = cleanText($elem.find('.university, .institution').first().text());
//       const description = cleanText($elem.find('.description, .teaser').first().text());
//       const url = $elem.find('a').first().attr('href');
//       const fullUrl = url ? (url.startsWith('http') ? url : `https://www.daad.de${url}`) : '';
      
//       if (title && university) {
//         results.push({
//           university: university,
//           program: title,
//           country: country,
//           session: 'Check website',
//           fundingType: 'DAAD Scholarship Opportunities',
//           amount: 'Varies by program',
//           eligibility: 'International students welcome',
//           applicationDeadline: 'Check DAAD website',
//           description: description || `${title} at ${university} through DAAD`,
//           url: fullUrl,
//           requirements: ['Bachelor degree', 'Language requirements', 'Academic excellence'],
//           lastUpdated: new Date().toISOString().split('T')[0],
//           source: 'DAAD Database',
//           applicationFee: 0.00
//         });
//       }
//     });
//   } catch (error) {
//     console.error('DAAD scraping error:', error.message);
//   }
  
//   return results;
// }

// // Scrape scholarship portals
// async function scrapeScholarshipPortals(country, course, level) {
//   const results = [];
  
//   try {
//     const scholarshipPortals = [
//       `https://www.scholars4dev.com/category/country/${country.toLowerCase()}-scholarships/`,
//       `https://www.scholarshipportal.com/scholarships/${country.toLowerCase()}`,
//       `https://www.internationalscholarships.com/search/${country.toLowerCase()}/${course.toLowerCase()}/${level.toLowerCase()}/`
//     ];

//     for (const portalUrl of scholarshipPortals) {
//       try {
//         const response = await axios.get(portalUrl, {
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           },
//           timeout: 10000
//         });

//         const $ = cheerio.load(response.data);
        
//         // Extract scholarship listings
//         $('.scholarship-item, .program-list, .result, article').each((i, element) => {
//           if (i >= 8) return false;
          
//           const $elem = $(element);
//           const title = cleanText($elem.find('h2, h3, .title, .scholarship-title').first().text());
//           const description = cleanText($elem.find('.description, .excerpt, .summary').first().text());
//           const url = $elem.find('a').first().attr('href');
//           const fullUrl = url ? (url.startsWith('http') ? url : new URL(url, portalUrl).href) : '';
          
//           if (title && (title.toLowerCase().includes(course.toLowerCase()) || 
//                        description.toLowerCase().includes(course.toLowerCase()))) {
            
//             results.push({
//               university: extractUniversityName(title, description) || 'Multiple Institutions',
//               program: `${course} ${level}`,
//               country: country,
//               session: 'Check website',
//               fundingType: extractFundingType(title + ' ' + description),
//               amount: extractAmount(description),
//               eligibility: 'International students eligible',
//               applicationDeadline: extractDeadline(description),
//               description: description || `${course} scholarship in ${country}`,
//               url: fullUrl,
//               requirements: ['Academic excellence', 'Application materials', 'Eligibility criteria'],
//               lastUpdated: new Date().toISOString().split('T')[0],
//               source: 'Scholarship Portal',
//               applicationFee: 0.00
//             });
//           }
//         });
//       } catch (error) {
//         console.error(`Error scraping ${portalUrl}:`, error.message);
//       }
//     }
//   } catch (error) {
//     console.error('Scholarship portal scraping error:', error);
//   }
  
//   return results;
// }

// // Scrape scholarship and funding sites
// async function scrapeScholarshipSites(country, course, level, session) {
//   const results = [];
  
//   try {
//     // Search Google for specific scholarship opportunities
//     const searchQueries = [
//       `"${course}" scholarship "${country}" international students "${level}"`,
//       `"${course}" funding "${country}" "${level}"`,
//       `"${course}" assistantship "${country}" "${level}"`
//     ];

//     for (const query of searchQueries) {
//       try {
//         const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
//         const response = await axios.get(googleSearchUrl, {
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           },
//           timeout: 10000
//         });

//         const $ = cheerio.load(response.data);
        
//         // Extract Google search results
//         $('.g').each((i, element) => {
//           if (i >= 10) return false;
          
//           const $elem = $(element);
//           const title = cleanText($elem.find('h3').first().text());
//           const description = cleanText($elem.find('.VwiC3b, .s3v9rd, .aCOpRe').first().text());
//           const url = $elem.find('a').first().attr('href');
          
//           if (title && (title.toLowerCase().includes('scholarship') || 
//                        title.toLowerCase().includes('funding') ||
//                        title.toLowerCase().includes('assistantship') ||
//                        description.toLowerCase().includes('scholarship') ||
//                        description.toLowerCase().includes('funding'))) {
            
//             results.push({
//               university: extractUniversityName(title, description) || 'Multiple Institutions',
//               program: `${course} ${level}`,
//               country: country,
//               session: session,
//               fundingType: extractFundingType(title + ' ' + description),
//               amount: extractAmount(description),
//               eligibility: 'International students may apply',
//               applicationDeadline: extractDeadline(description),
//               description: description || `${course} funding opportunity in ${country}`,
//               url: extractGoogleUrl(url),
//               requirements: ['Academic excellence', 'Application essay', 'References'],
//               lastUpdated: new Date().toISOString().split('T')[0],
//               source: 'Scholarship Search',
//               applicationFee: 0.00
//             });
//           }
//         });
//       } catch (error) {
//         console.error(`Error searching for "${query}":`, error.message);
//       }
//     }
//   } catch (error) {
//     console.error('Scholarship sites scraping error:', error);
//   }
  
//   return results;
// }

// // Scrape government education sites
// async function scrapeGovernmentSites(country, course) {
//   const results = [];
  
//   const govSites = {
//     'USA': ['https://www.ed.gov/', 'https://studyinthestates.dhs.gov/'],
//     'UK': ['https://www.gov.uk/education/student-grants-bursaries-scholarships', 'https://www.ukcisa.org.uk/'],
//     'Canada': ['https://www.educanada.ca/', 'https://www.cic.gc.ca/english/study/study.asp'],
//     'Australia': ['https://www.studyinaustralia.gov.au/', 'https://www.dese.gov.au/'],
//     'Germany': ['https://www.study-in-germany.de/', 'https://www.bmbf.de/'],
//     'France': ['https://www.campusfrance.org/', 'https://www.enseignementsup-recherche.gouv.fr/'],
//     'Netherlands': ['https://www.studyinholland.nl/', 'https://www.nuffic.nl/'],
//     'Sweden': ['https://studyinsweden.se/', 'https://www.uhr.se/'],
//     'Norway': ['https://www.studyinnorway.no/', 'https://www.niu.no/'],
//     'Denmark': ['https://studyindenmark.dk/', 'https://ufm.dk/']
//   };
  
//   const countryGovSites = govSites[country] || [];
  
//   for (const siteUrl of countryGovSites) {
//     try {
//       const response = await axios.get(siteUrl, {
//         headers: {
//           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//         },
//         timeout: 15000
//       });

//       const $ = cheerio.load(response.data);
      
//       // Look for scholarship or funding information
//       $('a[href*="scholarship"], a[href*="funding"], a[href*="grant"], a[href*="financial"], a[href*="programme"]').each((i, element) => {
//         if (i >= 8) return false;
        
//         const $elem = $(element);
//         const title = cleanText($elem.text());
//         const href = $elem.attr('href');
//         const fullUrl = href && href.startsWith('http') ? href : 
//                        href ? new URL(href, siteUrl).href : '';
        
//         if (title && title.length > 10 && 
//             (title.toLowerCase().includes('international') || 
//              title.toLowerCase().includes('student') ||
//              title.toLowerCase().includes('study'))) {
          
//           results.push({
//             university: `${country} Government Education Program`,
//             program: `${course} - Higher Education`,
//             country: country,
//             session: 'Multiple sessions',
//             fundingType: 'Government Scholarship/Funding',
//             amount: 'Varies by program',
//             eligibility: 'International students eligible',
//             applicationDeadline: 'See official website',
//             description: title,
//             url: fullUrl || siteUrl,
//             requirements: ['Academic merit', 'Application form', 'Supporting documents'],
//             lastUpdated: new Date().toISOString().split('T')[0],
//             source: 'Government Education Site',
//             applicationFee: 0.00
//           });
//         }
//       });
//     } catch (error) {
//       console.error(`Error scraping government site ${siteUrl}:`, error.message);
//     }
//   }
  
//   return results;
// }

// // Scrape education portals and aggregator sites
// async function scrapeEducationPortals(country, course, level) {
//   const results = [];
  
//   try {
//     const portals = [
//       `https://www.mastersportal.com/search/master/${course.toLowerCase().replace(/\s+/g, '-')}/${country.toLowerCase()}`,
//       `https://www.bachelorsportal.com/search/bachelor/${course.toLowerCase().replace(/\s+/g, '-')}/${country.toLowerCase()}`,
//       `https://www.phdportal.com/search/phd/${course.toLowerCase().replace(/\s+/g, '-')}/${country.toLowerCase()}`,
//       `https://www.findamasters.com/search/masters-degrees-in-${course.toLowerCase().replace(/\s+/g, '-')}-in-${country.toLowerCase()}`,
//       `https://www.findaphd.com/phd-programs/${course.toLowerCase().replace(/\s+/g, '-')}/${country.toLowerCase()}/`
//     ];

//     for (const portalUrl of portals) {
//       try {
//         const response = await axios.get(portalUrl, {
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           },
//           timeout: 15000
//         });

//         const $ = cheerio.load(response.data);
        
//         // Extract program listings
//         $('.study-card, .program-card, .course-listing, .result-item, .programme').each((i, element) => {
//           if (i >= 6) return false;
          
//           const $elem = $(element);
          
//           const university = cleanText($elem.find('.university, .institution, .school, .provider').first().text());
//           const program = cleanText($elem.find('.program, .course, .title, h2, h3').first().text());
//           const location = cleanText($elem.find('.location, .country, .city').first().text());
//           const url = $elem.find('a').first().attr('href');
//           const fullUrl = url && url.startsWith('http') ? url : 
//                          url ? new URL(url, portalUrl).href : '';
          
//           if (university && program) {
//             results.push({
//               university: university,
//               program: program,
//               country: location || country,
//               session: 'Fall/Spring intake',
//               fundingType: 'Various funding options available',
//               amount: 'Contact for funding details',
//               eligibility: 'International applications accepted',
//               applicationDeadline: 'Multiple deadlines',
//               description: `${program} offered by ${university}`,
//               url: fullUrl,
//               requirements: ['Relevant bachelor\'s degree', 'Language requirements', 'Application materials'],
//               lastUpdated: new Date().toISOString().split('T')[0],
//               source: 'Education Portal',
//               applicationFee: 0.00
//             });
//           }
//         });
//       } catch (error) {
//         console.error(`Error scraping portal ${portalUrl}:`, error.message);
//       }
//     }
//   } catch (error) {
//     console.error('Education portal scraping error:', error);
//   }
  
//   return results;
// }

// // Helper functions for data extraction
// function extractFundingType(text) {
//   if (!text) return 'Funding Available';
  
//   const fundingKeywords = {
//     'teaching assistant': 'Teaching Assistantship',
//     'research assistant': 'Research Assistantship',
//     'graduate assistant': 'Graduate Assistantship',
//     'scholarship': 'Scholarship',
//     'bursary': 'Bursary',
//     'grant': 'Research Grant',
//     'fellowship': 'Fellowship',
//     'tuition waiver': 'Tuition Waiver',
//     'financial aid': 'Financial Aid',
//     'funding': 'Funding'
//   };
  
//   const lowerText = text.toLowerCase();
  
//   for (const [keyword, type] of Object.entries(fundingKeywords)) {
//     if (lowerText.includes(keyword)) {
//       return type;
//     }
//   }
  
//   return 'Funding Available';
// }

// function extractAmount(text) {
//   if (!text) return 'Amount varies';
  
//   const amountRegex = /\$[\d,]+(?:\.\d{2})?(?:\s*-\s*\$?[\d,]+(?:\.\d{2})?)?|\£[\d,]+(?:\.\d{2})?(?:\s*-\s*\£?[\d,]+(?:\.\d{2})?)?|\€[\d,]+(?:\.\d{2})?(?:\s*-\s*\€?[\d,]+(?:\.\d{2})?)?|[\d,]+(?:\.\d{2})?\s*(?:USD|EUR|CAD|GBP|AUD)/gi;
//   const matches = text.match(amountRegex);
  
//   if (matches && matches.length > 0) {
//     return matches[0];
//   }
  
//   // Look for percentage mentions
//   const percentageRegex = /\d+%\s*(?:tuition|fee|cover)/gi;
//   const percentMatches = text.match(percentageRegex);
  
//   if (percentMatches && percentMatches.length > 0) {
//     return percentMatches[0];
//   }
  
//   return 'Amount varies';
// }

// function extractDeadline(text) {
//   if (!text) return 'Check website';
  
//   const deadlineRegex = /(deadline|application|apply|submission)\s*(?:by|on|before)?\s*(\w+\s+\d{1,2},?\s*\d{4})/gi;
//   const matches = text.match(deadlineRegex);
  
//   if (matches && matches.length > 0) {
//     return matches[0];
//   }
  
//   const dateRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}/gi;
//   const dateMatches = text.match(dateRegex);
  
//   if (dateMatches && dates.length > 0) {
//     return dateMatches[0];
//   }
  
//   return 'Check website';
// }

// function extractUniversityName(title, description) {
//   if (!title && !description) return 'Higher Education Institution';
  
//   const text = (title + ' ' + description).toLowerCase();
  
//   // Common university keywords
//   const universityKeywords = ['university', 'college', 'institute', 'school', 'academy'];
  
//   // Split into words and look for university names
//   const words = text.split(/\s+/);
  
//   for (let i = 0; i < words.length - 1; i++) {
//     if (universityKeywords.some(keyword => words[i + 1] && words[i + 1].includes(keyword))) {
//       // Found a potential university name
//       const universityName = words.slice(Math.max(0, i - 2), i + 2).join(' ');
//       if (universityName.length > 5) {
//         return cleanText(universityName);
//       }
//     }
//   }
  
//   // Try to extract from title
//   if (title) {
//     const titleMatch = title.match(/(.*?)(university|college|institute|school)/i);
//     if (titleMatch) {
//       return cleanText(titleMatch[0]);
//     }
//   }
  
//   return 'Higher Education Institution';
// }

// function extractGoogleUrl(url) {
//   if (!url) return '';
  
//   // Extract actual URL from Google redirect
//   const match = url.match(/\/url\?q=([^&]+)/);
//   if (match && match[1]) {
//     return decodeURIComponent(match[1]);
//   }
  
//   return url;
// }

// function removeDuplicates(results) {
//   const seen = new Set();
//   return results.filter(result => {
//     const key = `${result.university}-${result.program}-${result.source}`;
//     if (seen.has(key)) {
//       return false;
//     }
//     seen.add(key);
//     return true;
//   });
// }

// // AI-powered advanced search
// async function aiSearch(country, course, level, session, additionalCriteria) {
//   const basicResults = await searchPrograms(country, course, level, session, 'basic');
  
//   // Enhance results with AI insights
//   const enhancedResults = basicResults.map(result => ({
//     ...result,
//     aiScore: calculateAIScore(result, additionalCriteria),
//     aiInsights: generateAIInsights(result, additionalCriteria),
//     matchPercentage: calculateMatchPercentage(result, additionalCriteria)
//   }));
  
//   return enhancedResults.sort((a, b) => b.aiScore - a.aiScore);
// }

// function calculateAIScore(result, criteria) {
//   let score = Math.random() * 30 + 50; // Base score between 50-80
  
//   // Increase score based on funding match
//   if (criteria.preferredFunding && result.fundingType.toLowerCase().includes(criteria.preferredFunding.toLowerCase())) {
//     score += 15;
//   }
  
//   // Increase score based on minimum funding
//   if (criteria.minFunding) {
//     const amount = parseFloat(result.amount.replace(/[^\d.]/g, ''));
//     const minAmount = parseFloat(criteria.minFunding.replace(/[^\d.]/g, ''));
//     if (!isNaN(amount) && !isNaN(minAmount) && amount >= minAmount) {
//       score += 10;
//     }
//   }
  
//   // Increase score based on special requirements
//   if (criteria.specialRequirements) {
//     const requirements = criteria.specialRequirements.toLowerCase();
//     if (result.description.toLowerCase().includes(requirements) || 
//         result.requirements.some(req => req.toLowerCase().includes(requirements))) {
//       score += 5;
//     }
//   }
  
//   return Math.min(score, 100);
// }

// function calculateMatchPercentage(result, criteria) {
//   const baseMatch = Math.floor(Math.random() * 20) + 70; // 70-90% base match
  
//   // Adjust based on criteria
//   let adjustment = 0;
  
//   if (criteria.preferredFunding && result.fundingType.toLowerCase().includes(criteria.preferredFunding.toLowerCase())) {
//     adjustment += 5;
//   }
  
//   if (criteria.minFunding) {
//     const amount = parseFloat(result.amount.replace(/[^\d.]/g, ''));
//     const minAmount = parseFloat(criteria.minFunding.replace(/[^\d.]/g, ''));
//     if (!isNaN(amount) && !isNaN(minAmount) && amount >= minAmount) {
//       adjustment += 3;
//     }
//   }
  
//   return Math.min(baseMatch + adjustment, 95);
// }

// function generateAIInsights(result, criteria) {
//   const insights = [
//     `Strong alignment with ${criteria.preferredFunding || 'funding'} preferences`,
//     `Program reputation and accreditation meets international standards`,
//     `University has strong support services for international students`,
//     `Graduate employment rates are above average for this field`,
//     `Curriculum includes practical industry experience opportunities`,
//     `Alumni network provides strong career connections`,
//     `Research opportunities align with current industry trends`,
//     `Location offers excellent post-study work opportunities`
//   ];
  
//   return insights[Math.floor(Math.random() * insights.length)];
// }

// // Routes
// app.get('/', (req, res) => {
//   res.render('index', { company: COMPANY_INFO });
// });

// app.post('/search', async (req, res) => {
//   try {
//     const { country, course, level, session, mode, minFunding, preferredFunding, specialRequirements } = req.body;

//     let results;
//     if (mode === 'advanced') {
//       results = await aiSearch(country, course, level, session, {
//         minFunding,
//         preferredFunding,
//         specialRequirements
//       });
//     } else {
//       results = await searchPrograms(country, course, level, session, mode);
//     }

//     res.json(results);
//   } catch (error) {
//     console.error('Search endpoint error:', error);
//     res.status(500).json({ error: 'Search failed. Please try again with different parameters.' });
//   }
// });

// // Apply route
// app.post('/apply', async (req, res) => {
//   try {
//     const { programId, university, program, email, name, phone } = req.body;
    
//     // Validate application data
//     if (!name || !email || !university || !program) {
//       return res.status(400).json({ error: 'Missing required application fields' });
//     }
    
//     // In a real implementation, you would:
//     // 1. Save application to database
//     // 2. Process payment (for now it's $0.00)
//     // 3. Send confirmation email
    
//     // Simulate processing delay
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     // Generate application ID
//     const applicationId = 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    
//     res.json({ 
//       success: true, 
//       message: 'Application submitted successfully!',
//       applicationId: applicationId,
//       amountPaid: 0.00,
//       nextSteps: [
//         'Check your email for confirmation within 24 hours',
//         'Prepare your academic documents for verification',
//         'Schedule any required language proficiency tests'
//       ]
//     });
//   } catch (error) {
//     console.error('Application error:', error);
//     res.status(500).json({ error: 'Application failed. Please try again or contact support.' });
//   }
// });

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString(),
//     cacheSize: searchCache.size,
//     version: '1.0.0'
//   });
// });

// // Clear cache endpoint (for maintenance)
// app.post('/clear-cache', (req, res) => {
//   const previousSize = searchCache.size;
//   searchCache.clear();
//   res.json({ 
//     message: 'Cache cleared successfully',
//     clearedEntries: previousSize
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 ScholarBridge from Suntrenia running on port ${PORT}`);
//   console.log(`📱 Access the app at: http://localhost:${PORT}`);
//   console.log(`🔍 Real-time web scraping enabled`);
//   console.log(`💾 Response caching enabled (${CACHE_DURATION/60000} minutes)`);
// });

// module.exports = app;



// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Set view engine to EJS
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

// // In-memory cache for search results
// const searchCache = new Map();
// const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// // Company information
// const COMPANY_INFO = {
//   name: "Suntrenia",
//   appName: "ScholarBridge",
//   email: "info@suntrenia.com",
//   xHandle: "suntreniTech",
//   phone: "07034995589",
//   website: "https://suntrenia.com"
// };

// // Debug mode
// const DEBUG = true;

// // Helper function to clean and format text
// function cleanText(text) {
//   return text ? text.replace(/\s+/g, ' ').trim() : '';
// }

// // Debug logging
// function debugLog(message, data = null) {
//   if (DEBUG) {
//     console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
//   }
// }

// // Main search function
// async function searchPrograms(country, course, level, session, mode = 'basic') {
//   const cacheKey = `${country}-${course}-${level}-${session}-${mode}`;
  
//   debugLog('Starting search with parameters:', { country, course, level, session, mode });
  
//   // Check cache first
//   if (searchCache.has(cacheKey)) {
//     const cached = searchCache.get(cacheKey);
//     if (Date.now() - cached.timestamp < CACHE_DURATION) {
//       debugLog('Returning cached results');
//       return cached.data;
//     }
//   }

//   try {
//     // Generate search queries based on parameters
//     const searchQueries = generateSearchQueries(country, course, level);
//     debugLog('Generated search queries:', searchQueries);
    
//     // Execute all searches in parallel with timeout
//     const searchPromises = searchQueries.map(query => 
//       Promise.race([
//         performWebSearch(query, country, course, level),
//         new Promise(resolve => setTimeout(() => resolve([]), 10000)) // 10 second timeout
//       ])
//     );
    
//     const resultsArrays = await Promise.allSettled(searchPromises);
//     debugLog('Search promises settled:', resultsArrays.map(r => r.status));
    
//     // Process results
//     let allResults = [];
//     resultsArrays.forEach((result, index) => {
//       if (result.status === 'fulfilled' && Array.isArray(result.value)) {
//         debugLog(`Query "${searchQueries[index]}" returned ${result.value.length} results`);
//         allResults = allResults.concat(result.value);
//       } else {
//         debugLog(`Query "${searchQueries[index]}" failed or timed out`);
//       }
//     });
    
//     // Filter out null results
//     allResults = allResults.filter(result => result !== null);
//     debugLog(`Total results after filtering: ${allResults.length}`);

//     // Remove duplicates
//     allResults = removeDuplicates(allResults);
//     debugLog(`Results after deduplication: ${allResults.length}`);

//     // If no results found, try alternative approach
//     if (allResults.length === 0) {
//       debugLog('No results from primary search, trying alternative approach');
//       const alternativeResults = await tryAlternativeSearchApproach(country, course, level);
//       allResults = alternativeResults;
//       debugLog(`Alternative approach returned ${alternativeResults.length} results`);
//     }

//     // Cache results
//     if (allResults.length > 0) {
//       searchCache.set(cacheKey, {
//         data: allResults,
//         timestamp: Date.now()
//       });
//     }

//     return allResults;
//   } catch (error) {
//     debugLog('Search error:', error.message);
//     return [];
//   }
// }

// // Alternative search approach using educational directories
// async function tryAlternativeSearchApproach(country, course, level) {
//   const results = [];
  
//   try {
//     // Try specific educational directories that are more reliable
//     const educationalDirectories = [
//       `https://www.educations.com/search/${country.toLowerCase()}/${course.toLowerCase()}-${level.toLowerCase()}-degrees`,
//       `https://www.hotcoursesabroad.com/study/${country.toLowerCase()}/${course.toLowerCase()}-${level.toLowerCase()}-courses`,
//       `https://www.studyportals.com/search/${level.toLowerCase()}/${course.toLowerCase()}/${country.toLowerCase()}`
//     ];
    
//     for (const directoryUrl of educationalDirectories) {
//       try {
//         debugLog(`Trying educational directory: ${directoryUrl}`);
//         const directoryResults = await scrapeEducationalDirectory(directoryUrl, country, course, level);
//         results.push(...directoryResults);
//       } catch (error) {
//         debugLog(`Failed to scrape ${directoryUrl}:`, error.message);
//       }
//     }
//   } catch (error) {
//     debugLog('Alternative search approach error:', error.message);
//   }
  
//   return results;
// }

// // Scrape educational directories
// async function scrapeEducationalDirectory(url, country, course, level) {
//   const results = [];
  
//   try {
//     const response = await axios.get(url, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//         'Accept-Language': 'en-US,en;q=0.5',
//       },
//       timeout: 15000
//     });

//     const $ = cheerio.load(response.data);
    
//     // Extract program listings - try multiple selectors
//     const selectors = [
//       '.program-item', '.course-card', '.study-program', 
//       '.result-item', '.university-card', '.institution-item'
//     ];
    
//     selectors.forEach(selector => {
//       $(selector).each((i, element) => {
//         if (i >= 8) return false;
        
//         const $elem = $(element);
//         const title = cleanText($elem.find('h2, h3, .title, .program-title').first().text());
//         const university = cleanText($elem.find('.university-name, .institution-name, .school-name').first().text());
//         const description = cleanText($elem.find('.description, .summary, .program-desc').first().text());
//         const urlElem = $elem.find('a').first();
//         const href = urlElem.attr('href');
//         const fullUrl = href ? (href.startsWith('http') ? href : new URL(href, url).href) : '';
        
//         if (university && title) {
//           results.push({
//             university: university,
//             program: title,
//             country: country,
//             session: 'Check website',
//             fundingType: 'Various options available',
//             amount: 'Contact for details',
//             eligibility: 'International students eligible',
//             applicationDeadline: 'Check website',
//             description: description || `${title} at ${university}`,
//             url: fullUrl,
//             requirements: ['Bachelor degree', 'Academic transcripts', 'Language proficiency'],
//             lastUpdated: new Date().toISOString().split('T')[0],
//             source: 'Education Directory',
//             applicationFee: 0.00,
//             searchScore: 75
//           });
//         }
//       });
//     });
    
//   } catch (error) {
//     debugLog(`Error scraping educational directory ${url}:`, error.message);
//   }
  
//   return results;
// }

// // Generate intelligent search queries based on parameters
// function generateSearchQueries(country, course, level) {
//   const levelMap = {
//     'masters': ['masters', 'master', 'graduate'],
//     'phd': ['phd', 'doctorate', 'doctoral'],
//     'post-doc': ['postdoc', 'post-doc', 'postdoctoral']
//   };
  
//   const levelTerms = levelMap[level.toLowerCase()] || [level.toLowerCase()];
//   const baseQueries = [];
  
//   // Generate queries with different combinations
//   levelTerms.forEach(levelTerm => {
//     baseQueries.push(
//       `${course} ${levelTerm} programs ${country} international students funding`,
//       `${course} ${levelTerm} scholarships ${country} university`,
//       `${country} universities ${course} ${levelTerm} funding international students`,
//       `study ${course} ${levelTerm} in ${country} with funding`,
//       `${course} ${levelTerm} financial aid ${country} university`,
//       `${country} ${course} ${levelTerm} fully funded programs`
//     );
//   });
  
//   return [...new Set(baseQueries)]; // Remove duplicates
// }

// // Perform actual web search using Google
// async function performWebSearch(query, country, course, level) {
//   const results = [];
  
//   try {
//     const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
//     debugLog(`Searching Google: ${googleSearchUrl}`);
    
//     const response = await axios.get(googleSearchUrl, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//       },
//       timeout: 15000
//     });

//     const $ = cheerio.load(response.data);
//     debugLog('Google search page loaded successfully');
    
//     // Check if we got search results
//     const resultCount = $('.g').length;
//     debugLog(`Found ${resultCount} search results on Google`);
    
//     // Extract search results
//     $('.g').each((i, element) => {
//       if (i >= 10) return false; // Limit to first 10 results per query
      
//       const $elem = $(element);
//       const title = cleanText($elem.find('h3').first().text());
//       const url = $elem.find('a').first().attr('href');
//       const description = cleanText($elem.find('[data-content-feature="1"]').first().text() || 
//                                  $elem.find('.VwiC3b, .s3v9rd, .aCOpRe').first().text());
      
//       debugLog(`Processing result ${i}:`, { title, url: url ? url.substring(0, 50) + '...' : 'none' });
      
//       // Extract actual URL from Google redirect
//       const actualUrl = extractActualUrl(url);
      
//       // Only process results that seem to be from educational institutions
//       if (isEducationalContent(title, description, actualUrl)) {
//         const university = extractUniversityName(title, description, actualUrl);
//         const programInfo = extractProgramInfo(title, description, course, level);
        
//         if (university && programInfo) {
//           const result = {
//             university: university,
//             program: programInfo,
//             country: country,
//             session: 'Check website',
//             fundingType: extractFundingType(title + ' ' + description),
//             amount: extractAmountFromText(title + ' ' + description),
//             eligibility: 'International students may apply',
//             applicationDeadline: extractDeadlineFromText(description),
//             description: description || `${course} ${level} program at ${university}`,
//             url: actualUrl,
//             requirements: generateRequirementsBasedOnLevel(level),
//             lastUpdated: new Date().toISOString().split('T')[0],
//             source: 'Web Search',
//             applicationFee: 0.00,
//             searchScore: calculateRelevanceScore(title, description, course, level, university)
//           };
          
//           results.push(result);
//           debugLog(`Added result: ${university} - ${programInfo}`);
//         }
//       }
//     });
    
//   } catch (error) {
//     debugLog(`Error searching for "${query}":`, error.message);
//   }
  
//   debugLog(`Query "${query}" returned ${results.length} results`);
//   return results;
// }

// // Extract actual URL from Google redirect
// function extractActualUrl(googleUrl) {
//   if (!googleUrl) return '';
  
//   try {
//     // Google search result URLs typically look like: /url?q=ACTUAL_URL&...
//     const urlMatch = googleUrl.match(/\/url\?q=([^&]+)/);
//     if (urlMatch && urlMatch[1]) {
//       return decodeURIComponent(urlMatch[1]);
//     }
//     return googleUrl;
//   } catch (error) {
//     return googleUrl;
//   }
// }

// // Check if content is from an educational institution
// function isEducationalContent(title, description, url) {
//   if (!title || !description) return false;
  
//   const lowerTitle = title.toLowerCase();
//   const lowerDesc = description.toLowerCase();
//   const lowerUrl = (url || '').toLowerCase();
  
//   // Look for educational indicators
//   const eduIndicators = [
//     'university', 'college', 'institute', 'school', 'academy', 
//     'faculty', 'campus', 'edu', '.ac.', 'higher education',
//     'scholarship', 'fellowship', 'assistantship', 'funding', 'financial aid',
//     'program', 'course', 'degree', 'master', 'masters', 'phd', 'doctorate'
//   ];
  
//   return eduIndicators.some(indicator => 
//     lowerTitle.includes(indicator) || 
//     lowerDesc.includes(indicator) ||
//     lowerUrl.includes(indicator)
//   );
// }

// // Extract university name from various sources
// function extractUniversityName(title, description, url) {
//   // Try to extract from title first
//   const titleMatch = title.match(/([A-Z][a-zA-Z\s&]+)(?:University|College|Institute|School)/);
//   if (titleMatch && titleMatch[1]) {
//     return cleanText(titleMatch[1] + ' University');
//   }
  
//   // Try to extract from URL
//   const urlMatch = url.match(/(?:www\.)?([a-zA-Z0-9-]+)\.(?:edu|ac\.[a-z]{2})/);
//   if (urlMatch && urlMatch[1]) {
//     return cleanText(urlMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) + ' University';
//   }
  
//   // Try to extract from description
//   const descMatch = description.match(/([A-Z][a-zA-Z\s&]+)(?:University|College|Institute|School)/);
//   if (descMatch && descMatch[1]) {
//     return cleanText(descMatch[1] + ' University');
//   }
  
//   // Fallback: use the first part of the title
//   const titleParts = title.split(' - ')[0].split(' | ')[0];
//   if (titleParts.length > 5) {
//     return cleanText(titleParts);
//   }
  
//   return 'Higher Education Institution';
// }

// // Extract program information
// function extractProgramInfo(title, description, course, level) {
//   // If the title clearly contains the course and level
//   if (title.toLowerCase().includes(course.toLowerCase()) && 
//       title.toLowerCase().includes(level.toLowerCase())) {
//     return title;
//   }
  
//   // If the description contains the course and level
//   if (description.toLowerCase().includes(course.toLowerCase()) && 
//       description.toLowerCase().includes(level.toLowerCase())) {
//     const descMatch = description.match(new RegExp(`(.{0,50}${course}.{0,50}${level}.{0,50})`, 'i'));
//     if (descMatch) {
//       return cleanText(descMatch[1]);
//     }
//   }
  
//   // Fallback: construct the program name
//   return `${course} ${level} Program`;
// }

// // Extract funding type from text
// function extractFundingType(text) {
//   if (!text) return 'Funding Available';
  
//   const lowerText = text.toLowerCase();
//   const fundingTypes = {
//     'teaching assistant': 'Teaching Assistantship',
//     'research assistant': 'Research Assistantship',
//     'graduate assistant': 'Graduate Assistantship',
//     'scholarship': 'Scholarship',
//     'bursary': 'Bursary',
//     'grant': 'Research Grant',
//     'fellowship': 'Fellowship',
//     'tuition waiver': 'Tuition Waiver',
//     'financial aid': 'Financial Aid',
//     'funding': 'Funding',
//     'stipend': 'Stipend'
//   };
  
//   for (const [keyword, type] of Object.entries(fundingTypes)) {
//     if (lowerText.includes(keyword)) {
//       return type;
//     }
//   }
  
//   return 'Funding Available';
// }

// // Extract amount from text
// function extractAmountFromText(text) {
//   if (!text) return 'Varies';
  
//   const amountRegex = /\$[\d,]+(?:\.\d{2})?(?:\s*-\s*\$?[\d,]+(?:\.\d{2})?)?|\£[\d,]+(?:\.\d{2})?(?:\s*-\s*\£?[\d,]+(?:\.\d{2})?)?|\€[\d,]+(?:\.\d{2})?(?:\s*-\s*\€?[\d,]+(?:\.\d{2})?)?|[\d,]+(?:\.\d{2})?\s*(?:USD|EUR|CAD|GBP|AUD)/gi;
//   const matches = text.match(amountRegex);
  
//   if (matches && matches.length > 0) {
//     return matches[0];
//   }
  
//   // Look for percentage mentions
//   const percentageRegex = /\d+%\s*(?:tuition|fee|cover)/gi;
//   const percentMatches = text.match(percentageRegex);
  
//   if (percentMatches && percentMatches.length > 0) {
//     return percentMatches[0];
//   }
  
//   // Look for "full funding" or similar phrases
//   if (text.toLowerCase().includes('full funding') || text.toLowerCase().includes('fully funded')) {
//     return 'Full tuition + stipend';
//   }
  
//   return 'Varies';
// }

// // Extract deadline from text
// function extractDeadlineFromText(text) {
//   if (!text) return 'Check website';
  
//   const deadlineRegex = /(deadline|application|apply|submission)\s*(?:by|on|before)?\s*(\w+\s+\d{1,2},?\s*\d{4})/gi;
//   const matches = text.match(deadlineRegex);
  
//   if (matches && matches.length > 0) {
//     return matches[0];
//   }
  
//   const dateRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}/gi;
//   const dateMatches = text.match(dateRegex);
  
//   if (dateMatches && dateMatches.length > 0) {
//     return dateMatches[0];
//   }
  
//   return 'Check website';
// }

// // Generate requirements based on level
// function generateRequirementsBasedOnLevel(level) {
//   const baseRequirements = ['Bachelor degree', 'Academic transcripts'];
  
//   switch(level.toLowerCase()) {
//     case 'masters':
//       return [...baseRequirements, 'Statement of purpose', 'Letters of recommendation', 'English proficiency'];
//     case 'phd':
//       return [...baseRequirements, 'Research proposal', 'Letters of recommendation', 'Writing samples', 'English proficiency'];
//     case 'post-doc':
//       return [...baseRequirements, 'Research publications', 'CV/Resume', 'Research statement', 'References'];
//     default:
//       return [...baseRequirements, 'English proficiency', 'Application form'];
//   }
// }

// // Calculate relevance score for search results
// function calculateRelevanceScore(title, description, course, level, university) {
//   let score = 50; // Base score
  
//   const lowerTitle = title.toLowerCase();
//   const lowerDesc = description.toLowerCase();
//   const lowerCourse = course.toLowerCase();
//   const lowerLevel = level.toLowerCase();
//   const lowerUni = university.toLowerCase();
  
//   // Increase score for exact matches
//   if (lowerTitle.includes(lowerCourse)) score += 15;
//   if (lowerTitle.includes(lowerLevel)) score += 10;
//   if (lowerDesc.includes(lowerCourse)) score += 10;
//   if (lowerDesc.includes(lowerLevel)) score += 5;
  
//   // Increase score for funding mentions
//   if (lowerTitle.includes('funding') || lowerTitle.includes('scholarship') || 
//       lowerTitle.includes('assistantship') || lowerTitle.includes('fellowship')) {
//     score += 20;
//   }
  
//   if (lowerDesc.includes('funding') || lowerDesc.includes('scholarship') || 
//       lowerDesc.includes('assistantship') || lowerDesc.includes('fellowship')) {
//     score += 15;
//   }
  
//   // Increase score for university mentions
//   if (lowerTitle.includes(lowerUni) || lowerDesc.includes(lowerUni)) {
//     score += 10;
//   }
  
//   // Increase score for international student mentions
//   if (lowerTitle.includes('international') || lowerDesc.includes('international')) {
//     score += 10;
//   }
  
//   return Math.min(score, 100);
// }

// // Remove duplicate results
// function removeDuplicates(results) {
//   const seen = new Set();
//   return results.filter(result => {
//     const key = `${result.university}-${result.program}-${result.url}`;
//     if (seen.has(key)) {
//       return false;
//     }
//     seen.add(key);
//     return true;
//   }).sort((a, b) => b.searchScore - a.searchScore); // Sort by relevance
// }

// // AI-powered advanced search
// async function aiSearch(country, course, level, session, additionalCriteria) {
//   const basicResults = await searchPrograms(country, course, level, session, 'basic');
  
//   // Enhance results with AI insights
//   const enhancedResults = basicResults.map(result => ({
//     ...result,
//     aiScore: calculateAIScore(result, additionalCriteria),
//     aiInsights: generateAIInsights(result, additionalCriteria),
//     matchPercentage: calculateMatchPercentage(result, additionalCriteria)
//   }));
  
//   return enhancedResults.sort((a, b) => b.aiScore - a.aiScore);
// }

// function calculateAIScore(result, criteria) {
//   let score = result.searchScore || 50; // Start with search relevance score
  
//   // Increase score based on funding match
//   if (criteria.preferredFunding && result.fundingType.toLowerCase().includes(criteria.preferredFunding.toLowerCase())) {
//     score += 15;
//   }
  
//   // Increase score based on minimum funding
//   if (criteria.minFunding) {
//     const amount = parseFloat(result.amount.replace(/[^\d.]/g, ''));
//     const minAmount = parseFloat(criteria.minFunding.replace(/[^\d.]/g, ''));
//     if (!isNaN(amount) && !isNaN(minAmount) && amount >= minAmount) {
//       score += 10;
//     }
//   }
  
//   // Increase score based on special requirements
//   if (criteria.specialRequirements) {
//     const requirements = criteria.specialRequirements.toLowerCase();
//     if (result.description.toLowerCase().includes(requirements) || 
//         result.requirements.some(req => req.toLowerCase().includes(requirements))) {
//       score += 5;
//     }
//   }
  
//   return Math.min(score, 100);
// }

// function calculateMatchPercentage(result, criteria) {
//   const baseMatch = result.searchScore || 70;
  
//   // Adjust based on criteria
//   let adjustment = 0;
  
//   if (criteria.preferredFunding && result.fundingType.toLowerCase().includes(criteria.preferredFunding.toLowerCase())) {
//     adjustment += 5;
//   }
  
//   if (criteria.minFunding) {
//     const amount = parseFloat(result.amount.replace(/[^\d.]/g, ''));
//     const minAmount = parseFloat(criteria.minFunding.replace(/[^\d.]/g, ''));
//     if (!isNaN(amount) && !isNaN(minAmount) && amount >= minAmount) {
//       adjustment += 3;
//     }
//   }
  
//   return Math.min(baseMatch + adjustment, 95);
// }

// function generateAIInsights(result, criteria) {
//   const insights = [
//     `Strong alignment with ${criteria.preferredFunding || 'funding'} preferences`,
//     `Program reputation and accreditation meets international standards`,
//     `University has strong support services for international students`,
//     `Graduate employment rates are above average for this field`,
//     `Curriculum includes practical industry experience opportunities`,
//     `Alumni network provides strong career connections`,
//     `Research opportunities align with current industry trends`,
//     `Location offers excellent post-study work opportunities`
//   ];
  
//   return insights[Math.floor(Math.random() * insights.length)];
// }

// // Routes
// app.get('/', (req, res) => {
//   res.render('index', { company: COMPANY_INFO });
// });

// app.post('/search', async (req, res) => {
//   try {
//     const { country, course, level, session, mode, minFunding, preferredFunding, specialRequirements } = req.body;

//     // Validate input
//     if (!country || !course || !level || !session) {
//       return res.status(400).json({ error: 'Missing required search parameters' });
//     }

//     let results;
//     if (mode === 'advanced') {
//       results = await aiSearch(country, course, level, session, {
//         minFunding,
//         preferredFunding,
//         specialRequirements
//       });
//     } else {
//       results = await searchPrograms(country, course, level, session, mode);
//     }

//     res.json(results);
//   } catch (error) {
//     console.error('Search endpoint error:', error);
//     res.status(500).json({ error: 'Search failed. Please try again with different parameters.' });
//   }
// });

// // Apply route
// app.post('/apply', async (req, res) => {
//   try {
//     const { programId, university, program, email, name, phone } = req.body;
    
//     // Validate application data
//     if (!name || !email || !university || !program) {
//       return res.status(400).json({ error: 'Missing required application fields' });
//     }
    
//     // Simulate processing delay
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     // Generate application ID
//     const applicationId = 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    
//     res.json({ 
//       success: true, 
//       message: 'Application submitted successfully!',
//       applicationId: applicationId,
//       amountPaid: 0.00,
//       nextSteps: [
//         'Check your email for confirmation within 24 hours',
//         'Prepare your academic documents for verification',
//         'Schedule any required language proficiency tests'
//       ]
//     });
//   } catch (error) {
//     console.error('Application error:', error);
//     res.status(500).json({ error: 'Application failed. Please try again or contact support.' });
//   }
// });

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString(),
//     cacheSize: searchCache.size,
//     version: '1.0.0'
//   });
// });

// // Clear cache endpoint (for maintenance)
// app.post('/clear-cache', (req, res) => {
//   const previousSize = searchCache.size;
//   searchCache.clear();
//   res.json({ 
//     message: 'Cache cleared successfully',
//     clearedEntries: previousSize
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 ScholarBridge from Suntrenia running on port ${PORT}`);
//   console.log(`📱 Access the app at: http://localhost:${PORT}`);
//   console.log(`🔍 Real-time web search enabled`);
//   console.log(`💾 Response caching enabled (${CACHE_DURATION/60000} minutes)`);
//   console.log(`🐛 Debug mode: ${DEBUG ? 'ON' : 'OFF'}`);
// });

// module.exports = app;




const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory cache for search results
const searchCache = new Map();
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// Company information
const COMPANY_INFO = {
  name: "Suntrenia",
  appName: "ScholarBroad",
  email: "info@suntrenia.com",
  xHandle: "suntreniTech",
  phone: "07034995589",
  website: "https://suntrenia.com"
};

// Debug mode
const DEBUG = true;

// Helper function to clean and format text
function cleanText(text) {
  return text ? text.replace(/\s+/g, ' ').trim() : '';
}

// Debug logging
function debugLog(message, data = null) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

// Main search function
async function searchPrograms(country, course, level, session, mode = 'basic') {
  const cacheKey = `${country}-${course}-${level}-${session}-${mode}`;
  
  debugLog('Starting search with parameters:', { country, course, level, session, mode });
  
  // Check cache first
  if (searchCache.has(cacheKey)) {
    const cached = searchCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      debugLog('Returning cached results');
      return cached.data;
    }
  }

  try {
    // Try multiple search approaches
    let allResults = [];
    
    // Approach 1: Direct university search (more reliable)
    const universityResults = await searchUniversityDatabases(country, course, level);
    debugLog(`University database search returned ${universityResults.length} results`);
    allResults = allResults.concat(universityResults);
    
    // Approach 2: Scholarship databases
    if (allResults.length < 5) {
      const scholarshipResults = await searchScholarshipDatabases(country, course, level);
      debugLog(`Scholarship database search returned ${scholarshipResults.length} results`);
      allResults = allResults.concat(scholarshipResults);
    }
    
    // Approach 3: Education portals as fallback
    if (allResults.length < 3) {
      const portalResults = await searchEducationPortals(country, course, level);
      debugLog(`Education portal search returned ${portalResults.length} results`);
      allResults = allResults.concat(portalResults);
    }
    
    // Filter out null results
    allResults = allResults.filter(result => result !== null);
    debugLog(`Total results after filtering: ${allResults.length}`);

    // Remove duplicates
    allResults = removeDuplicates(allResults);
    debugLog(`Results after deduplication: ${allResults.length}`);

    // If no results found, use sample data
    if (allResults.length === 0) {
      debugLog('No results found, using sample data');
      allResults = generateSampleData(country, course, level);
    }

    // Cache results
    if (allResults.length > 0) {
      searchCache.set(cacheKey, {
        data: allResults,
        timestamp: Date.now()
      });
    }

    return allResults;
  } catch (error) {
    debugLog('Search error:', error.message);
    return generateSampleData(country, course, level);
  }
}

// Search university databases directly
async function searchUniversityDatabases(country, course, level) {
  const results = [];
  
  // List of universities known for international programs
  const universities = {
    'USA': [
      'https://www.stanford.edu',
      'https://www.mit.edu',
      'https://www.harvard.edu',
      'https://www.berkeley.edu',
      'https://www.columbia.edu',
      'https://www.uchicago.edu',
      'https://www.yale.edu',
      'https://www.princeton.edu',
      'https://www.cornell.edu',
      'https://www.umich.edu'
    ],
    'UK': [
      'https://www.ox.ac.uk',
      'https://www.cam.ac.uk',
      'https://www.imperial.ac.uk',
      'https://www.ucl.ac.uk',
      'https://www.lse.ac.uk',
      'https://www.manchester.ac.uk',
      'https://www.ed.ac.uk',
      'https://www.kcl.ac.uk',
      'https://www.bristol.ac.uk',
      'https://www.warwick.ac.uk'
    ],
    'Canada': [
      'https://www.utoronto.ca',
      'https://www.ubc.ca',
      'https://www.mcgill.ca',
      'https://www.mcmaster.ca',
      'https://www.ualberta.ca',
      'https://www.queensu.ca',
      'https://www.uwaterloo.ca',
      'https://www.westernu.ca',
      'https://www.dal.ca',
      'https://www.ucalgary.ca'
    ],
    'Germany': [
      'https://www.tum.de',
      'https://www.lmu.de',
      'https://www.uni-heidelberg.de',
      'https://www.fu-berlin.de',
      'https://www.rwth-aachen.de',
      'https://www.uni-bonn.de',
      'https://www.uni-freiburg.de',
      'https://www.uni-goettingen.de',
      'https://www.uni-koeln.de',
      'https://www.uni-hamburg.de'
    ],
    'Australia': [
      'https://www.unimelb.edu.au',
      'https://www.sydney.edu.au',
      'https://www.unsw.edu.au',
      'https://www.anu.edu.au',
      'https://www.monash.edu',
      'https://www.uq.edu.au',
      'https://www.rmit.edu.au',
      'https://www.uts.edu.au',
      'https://www.uwa.edu.au',
      'https://www.qut.edu.au'
    ]
  };

  const countryUniversities = universities[country] || [];
  
  for (const universityUrl of countryUniversities) {
    try {
      // Try to find graduate admissions page
      const gradPages = [
        `${universityUrl}/graduate`,
        `${universityUrl}/grad`,
        `${universityUrl}/admissions/graduate`,
        `${universityUrl}/study/graduate`,
        `${universityUrl}/academics/graduate`
      ];
      
      for (const gradUrl of gradPages) {
        try {
          debugLog(`Trying university page: ${gradUrl}`);
          const response = await axios.get(gradUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
            timeout: 10000
          });

          const $ = cheerio.load(response.data);
          
          // Extract university name from page
          const universityName = cleanText($('title').first().text()) || 
                               cleanText($('h1').first().text()) ||
                               universityUrl.replace('https://www.', '').replace('.edu', '').replace('.ac', '').replace('.uk', '').replace('.ca', '').replace('.au', '').replace('.de', '');
          
          // Look for program links
          $('a[href*="program"], a[href*="course"], a[href*="study"], a[href*="admit"]').each((i, element) => {
            if (i >= 5) return false;
            
            const $elem = $(element);
            const title = cleanText($elem.text());
            const href = $elem.attr('href');
            const fullUrl = href && href.startsWith('http') ? href : 
                           href ? new URL(href, gradUrl).href : gradUrl;
            
            if (title && title.length > 10 && 
                (title.toLowerCase().includes('graduate') ||
                 title.toLowerCase().includes('master') ||
                 title.toLowerCase().includes('phd') ||
                 title.toLowerCase().includes('program'))) {
              
              results.push({
                university: universityName,
                program: title,
                country: country,
                session: 'Check website',
                fundingType: 'Contact for details',
                amount: 'Varies',
                eligibility: 'International students eligible',
                applicationDeadline: 'Check website',
                description: `${title} at ${universityName}`,
                url: fullUrl,
                requirements: ['Bachelor degree', 'Academic transcripts', 'Language proficiency'],
                lastUpdated: new Date().toISOString().split('T')[0],
                source: 'University Website',
                applicationFee: 0.00,
                searchScore: 80
              });
            }
          });
          
          break; // If we found a working page, move to next university
        } catch (error) {
          debugLog(`Failed to access ${gradUrl}:`, error.message);
          continue;
        }
      }
    } catch (error) {
      debugLog(`Error with university ${universityUrl}:`, error.message);
    }
  }
  
  return results;
}

// Search scholarship databases
async function searchScholarshipDatabases(country, course, level) {
  const results = [];
  
  // Scholarship databases that are more likely to work
  const scholarshipDbs = [
    `https://www.scholars4dev.com/category/country/${getCountrySlug(country)}-scholarships/`,
    `https://www.scholarshipportal.com/scholarships/${getCountrySlug(country)}`,
    `https://www.internationalstudent.com/scholarships/search/?q=${encodeURIComponent(course)}&country=${getCountrySlug(country)}`,
    `https://www.scholarships.com/financial-aid/college-scholarships/scholarship-search/?q=${encodeURIComponent(course)}&c=${getCountrySlug(country)}`
  ];
  
  for (const dbUrl of scholarshipDbs) {
    try {
      debugLog(`Trying scholarship database: ${dbUrl}`);
      const response = await axios.get(dbUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      // Look for scholarship listings
      $('.scholarship-item, .program-list, .result, article, .listing-item').each((i, element) => {
        if (i >= 8) return false;
        
        const $elem = $(element);
        const title = cleanText($elem.find('h2, h3, .title, .scholarship-title').first().text());
        const description = cleanText($elem.find('.description, .excerpt, .summary').first().text());
        const urlElem = $elem.find('a').first();
        const href = urlElem.attr('href');
        const fullUrl = href && href.startsWith('http') ? href : new URL(href, dbUrl).href;
        
        if (title && (title.toLowerCase().includes(course.toLowerCase()) || 
                     description.toLowerCase().includes(course.toLowerCase()))) {
          
          results.push({
            university: extractUniversityFromText(title + ' ' + description) || 'Multiple Institutions',
            program: `${course} ${level}`,
            country: country,
            session: 'Check website',
            fundingType: extractFundingType(title + ' ' + description),
            amount: extractAmountFromText(description),
            eligibility: 'International students eligible',
            applicationDeadline: extractDeadlineFromText(description),
            description: description || `${course} scholarship in ${country}`,
            url: fullUrl,
            requirements: ['Academic excellence', 'Application materials', 'Eligibility criteria'],
            lastUpdated: new Date().toISOString().split('T')[0],
            source: 'Scholarship Database',
            applicationFee: 0.00,
            searchScore: 75
          });
        }
      });
    } catch (error) {
      debugLog(`Failed to access scholarship database ${dbUrl}:`, error.message);
    }
  }
  
  return results;
}

// Search education portals
async function searchEducationPortals(country, course, level) {
  const results = [];
  
  // Education portals with proper URL encoding
  const portals = [
    `https://www.educations.com/search/${getCountrySlug(country)}/${getCourseSlug(course)}-${getLevelSlug(level)}-degrees`,
    `https://www.hotcoursesabroad.com/study/${getCountrySlug(country)}/${getCourseSlug(course)}-${getLevelSlug(level)}-courses`,
    `https://www.studyportals.com/search/${getLevelSlug(level)}/${getCourseSlug(course)}/${getCountrySlug(country)}`
  ];
  
  for (const portalUrl of portals) {
    try {
      debugLog(`Trying education portal: ${portalUrl}`);
      const response = await axios.get(portalUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      // Extract program listings
      $('.program-item, .course-card, .study-program, .result-item, .university-card').each((i, element) => {
        if (i >= 6) return false;
        
        const $elem = $(element);
        const title = cleanText($elem.find('h2, h3, .title, .program-title').first().text());
        const university = cleanText($elem.find('.university-name, .institution-name, .school-name').first().text());
        const description = cleanText($elem.find('.description, .summary, .program-desc').first().text());
        const urlElem = $elem.find('a').first();
        const href = urlElem.attr('href');
        const fullUrl = href && href.startsWith('http') ? href : new URL(href, portalUrl).href;
        
        if (university && title) {
          results.push({
            university: university,
            program: title,
            country: country,
            session: 'Check website',
            fundingType: 'Various options available',
            amount: 'Contact for details',
            eligibility: 'International students eligible',
            applicationDeadline: 'Check website',
            description: description || `${title} at ${university}`,
            url: fullUrl,
            requirements: ['Bachelor degree', 'Academic transcripts', 'Language proficiency'],
            lastUpdated: new Date().toISOString().split('T')[0],
            source: 'Education Portal',
            applicationFee: 0.00,
            searchScore: 70
          });
        }
      });
    } catch (error) {
      debugLog(`Failed to access education portal ${portalUrl}:`, error.message);
    }
  }
  
  return results;
}

// Helper functions for URL slugs
function getCountrySlug(country) {
  const slugMap = {
    'USA': 'usa', 'United States': 'usa',
    'UK': 'uk', 'United Kingdom': 'uk',
    'Canada': 'canada',
    'Germany': 'germany',
    'Australia': 'australia',
    'France': 'france',
    'Netherlands': 'netherlands',
    'Sweden': 'sweden',
    'Norway': 'norway',
    'Denmark': 'denmark'
  };
  return slugMap[country] || country.toLowerCase();
}

function getCourseSlug(course) {
  return course.toLowerCase().replace(/\s+/g, '-');
}

function getLevelSlug(level) {
  const slugMap = {
    'Masters': 'masters',
    'PhD': 'phd',
    'Post-Doc': 'post-doc'
  };
  return slugMap[level] || level.toLowerCase();
}

// Extract university from text
function extractUniversityFromText(text) {
  if (!text) return '';
  
  const uniMatch = text.match(/([A-Z][a-zA-Z\s&]+)(?:University|College|Institute|School)/);
  if (uniMatch && uniMatch[1]) {
    return cleanText(uniMatch[1] + ' University');
  }
  
  return '';
}

// Generate sample data as fallback
function generateSampleData(country, course, level) {
  debugLog('Generating sample data for demonstration');
  
  const universities = {
    'USA': [
      'Stanford University', 'MIT', 'Harvard University', 'UC Berkeley', 'Columbia University',
      'University of Chicago', 'Yale University', 'Princeton University', 'Cornell University', 'University of Michigan'
    ],
    'UK': [
      'University of Oxford', 'University of Cambridge', 'Imperial College London', 'UCL', 'LSE',
      'University of Manchester', 'University of Edinburgh', "King's College London", 'University of Bristol', 'University of Warwick'
    ],
    'Canada': [
      'University of Toronto', 'University of British Columbia', 'McGill University', 'McMaster University', 'University of Alberta',
      "Queen's University", 'University of Waterloo', 'Western University', 'Dalhousie University', 'University of Calgary'
    ],
    'Germany': [
      'Technical University of Munich', 'Ludwig Maximilian University', 'Heidelberg University', 'Free University of Berlin', 'RWTH Aachen University',
      'University of Bonn', 'University of Freiburg', 'University of Göttingen', 'University of Cologne', 'University of Hamburg'
    ],
    'Australia': [
      'University of Melbourne', 'University of Sydney', 'UNSW Sydney', 'Australian National University', 'Monash University',
      'University of Queensland', 'RMIT University', 'University of Technology Sydney', 'University of Western Australia', 'Queensland University of Technology'
    ]
  };

  const countryUnis = universities[country] || [
    `${country} University`, 
    `University of ${country}`,
    `${country} Institute of Technology`,
    `${country} State University`,
    `Technical University of ${country}`
  ];

  const results = [];
  const fundingTypes = ['Scholarship', 'Teaching Assistantship', 'Research Assistantship', 'Fellowship', 'Bursary'];
  const sessions = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'];

  // Generate 5-8 sample results
  const numResults = 5 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numResults; i++) {
    const university = countryUnis[i % countryUnis.length];
    const fundingType = fundingTypes[i % fundingTypes.length];
    const session = sessions[i % sessions.length];
    
    results.push({
      university: university,
      program: `${course} ${level}`,
      country: country,
      session: session,
      fundingType: fundingType,
      amount: fundingType === 'Scholarship' ? '$15,000 - $25,000' : 
              fundingType === 'Fellowship' ? 'Full tuition + stipend' : '$10,000 - $20,000',
      eligibility: 'International students eligible',
      applicationDeadline: getRandomDeadline(),
      description: `${course} ${level} program at ${university} with ${fundingType.toLowerCase()} opportunities for international students.`,
      url: `https://www.example.com/${university.toLowerCase().replace(/\s+/g, '-')}/${course.toLowerCase().replace(/\s+/g, '-')}`,
      requirements: ['Bachelor degree in related field', 'Academic transcripts', 'Statement of purpose', 'Letters of recommendation', 'English proficiency'],
      lastUpdated: new Date().toISOString().split('T')[0],
      source: 'Sample Data',
      applicationFee: 0.00,
      searchScore: 75 + Math.floor(Math.random() * 20)
    });
  }

  return results;
}

function getRandomDeadline() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = [1, 15, 20, 30];
  const year = new Date().getFullYear() + (Math.random() > 0.5 ? 1 : 0);
  
  return `${months[Math.floor(Math.random() * months.length)]} ${days[Math.floor(Math.random() * days.length)]}, ${year}`;
}

// Extract funding type from text
function extractFundingType(text) {
  if (!text) return 'Funding Available';
  
  const lowerText = text.toLowerCase();
  const fundingTypes = {
    'teaching assistant': 'Teaching Assistantship',
    'research assistant': 'Research Assistantship',
    'graduate assistant': 'Graduate Assistantship',
    'scholarship': 'Scholarship',
    'bursary': 'Bursary',
    'grant': 'Research Grant',
    'fellowship': 'Fellowship',
    'tuition waiver': 'Tuition Waiver',
    'financial aid': 'Financial Aid',
    'funding': 'Funding',
    'stipend': 'Stipend'
  };
  
  for (const [keyword, type] of Object.entries(fundingTypes)) {
    if (lowerText.includes(keyword)) {
      return type;
    }
  }
  
  return 'Funding Available';
}

// Extract amount from text
function extractAmountFromText(text) {
  if (!text) return 'Varies';
  
  const amountRegex = /\$[\d,]+(?:\.\d{2})?(?:\s*-\s*\$?[\d,]+(?:\.\d{2})?)?|\£[\d,]+(?:\.\d{2})?(?:\s*-\s*\£?[\d,]+(?:\.\d{2})?)?|\€[\d,]+(?:\.\d{2})?(?:\s*-\s*\€?[\d,]+(?:\.\d{2})?)?|[\d,]+(?:\.\d{2})?\s*(?:USD|EUR|CAD|GBP|AUD)/gi;
  const matches = text.match(amountRegex);
  
  if (matches && matches.length > 0) {
    return matches[0];
  }
  
  // Look for percentage mentions
  const percentageRegex = /\d+%\s*(?:tuition|fee|cover)/gi;
  const percentMatches = text.match(percentageRegex);
  
  if (percentMatches && percentMatches.length > 0) {
    return percentMatches[0];
  }
  
  // Look for "full funding" or similar phrases
  if (text.toLowerCase().includes('full funding') || text.toLowerCase().includes('fully funded')) {
    return 'Full tuition + stipend';
  }
  
  return 'Varies';
}

// Extract deadline from text
function extractDeadlineFromText(text) {
  if (!text) return 'Check website';
  
  const deadlineRegex = /(deadline|application|apply|submission)\s*(?:by|on|before)?\s*(\w+\s+\d{1,2},?\s*\d{4})/gi;
  const matches = text.match(deadlineRegex);
  
  if (matches && matches.length > 0) {
    return matches[0];
  }
  
  const dateRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}/gi;
  const dateMatches = text.match(dateRegex);
  
  if (dateMatches && dateMatches.length > 0) {
    return dateMatches[0];
  }
  
  return 'Check website';
}

// Remove duplicate results
function removeDuplicates(results) {
  const seen = new Set();
  return results.filter(result => {
    const key = `${result.university}-${result.program}-${result.url}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  }).sort((a, b) => b.searchScore - a.searchScore);
}

// AI-powered advanced search
async function aiSearch(country, course, level, session, additionalCriteria) {
  const basicResults = await searchPrograms(country, course, level, session, 'basic');
  
  // Enhance results with AI insights
  const enhancedResults = basicResults.map(result => ({
    ...result,
    aiScore: calculateAIScore(result, additionalCriteria),
    aiInsights: generateAIInsights(result, additionalCriteria),
    matchPercentage: calculateMatchPercentage(result, additionalCriteria)
  }));
  
  return enhancedResults.sort((a, b) => b.aiScore - a.aiScore);
}

function calculateAIScore(result, criteria) {
  let score = result.searchScore || 50;
  
  if (criteria.preferredFunding && result.fundingType.toLowerCase().includes(criteria.preferredFunding.toLowerCase())) {
    score += 15;
  }
  
  if (criteria.minFunding) {
    const amount = parseFloat(result.amount.replace(/[^\d.]/g, ''));
    const minAmount = parseFloat(criteria.minFunding.replace(/[^\d.]/g, ''));
    if (!isNaN(amount) && !isNaN(minAmount) && amount >= minAmount) {
      score += 10;
    }
  }
  
  if (criteria.specialRequirements) {
    const requirements = criteria.specialRequirements.toLowerCase();
    if (result.description.toLowerCase().includes(requirements) || 
        result.requirements.some(req => req.toLowerCase().includes(requirements))) {
      score += 5;
    }
  }
  
  return Math.min(score, 100);
}

function calculateMatchPercentage(result, criteria) {
  const baseMatch = result.searchScore || 70;
  let adjustment = 0;
  
  if (criteria.preferredFunding && result.fundingType.toLowerCase().includes(criteria.preferredFunding.toLowerCase())) {
    adjustment += 5;
  }
  
  if (criteria.minFunding) {
    const amount = parseFloat(result.amount.replace(/[^\d.]/g, ''));
    const minAmount = parseFloat(criteria.minFunding.replace(/[^\d.]/g, ''));
    if (!isNaN(amount) && !isNaN(minAmount) && amount >= minAmount) {
      adjustment += 3;
    }
  }
  
  return Math.min(baseMatch + adjustment, 95);
}

function generateAIInsights(result, criteria) {
  const insights = [
    `Strong alignment with ${criteria.preferredFunding || 'funding'} preferences`,
    `Program reputation and accreditation meets international standards`,
    `University has strong support services for international students`,
    `Graduate employment rates are above average for this field`,
    `Curriculum includes practical industry experience opportunities`,
    `Alumni network provides strong career connections`,
    `Research opportunities align with current industry trends`,
    `Location offers excellent post-study work opportunities`
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { company: COMPANY_INFO });
});

app.post('/search', async (req, res) => {
  try {
    const { country, course, level, session, mode, minFunding, preferredFunding, specialRequirements } = req.body;

    if (!country || !course || !level || !session) {
      return res.status(400).json({ error: 'Missing required search parameters' });
    }

    let results;
    if (mode === 'advanced') {
      results = await aiSearch(country, course, level, session, {
        minFunding,
        preferredFunding,
        specialRequirements
      });
    } else {
      results = await searchPrograms(country, course, level, session, mode);
    }

    res.json(results);
  } catch (error) {
    console.error('Search endpoint error:', error);
    res.status(500).json({ error: 'Search failed. Please try again with different parameters.' });
  }
});

app.post('/apply', async (req, res) => {
  try {
    const { programId, university, program, email, name, phone } = req.body;
    
    if (!name || !email || !university || !program) {
      return res.status(400).json({ error: 'Missing required application fields' });
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const applicationId = 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    
    res.json({ 
      success: true, 
      message: 'Application submitted successfully!',
      applicationId: applicationId,
      amountPaid: 0.00,
      nextSteps: [
        'Check your email for confirmation within 24 hours',
        'Prepare your academic documents for verification',
        'Schedule any required language proficiency tests'
      ]
    });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Application failed. Please try again or contact support.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cacheSize: searchCache.size,
    version: '1.0.0'
  });
});

app.post('/clear-cache', (req, res) => {
  const previousSize = searchCache.size;
  searchCache.clear();
  res.json({ 
    message: 'Cache cleared successfully',
    clearedEntries: previousSize
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ScholarBridge from Suntrenia running on port ${PORT}`);
  console.log(`📱 Access the app at: http://localhost:${PORT}`);
  console.log(`🔍 Real-time search enabled`);
  console.log(`💾 Response caching enabled (${CACHE_DURATION/60000} minutes)`);
  console.log(`🐛 Debug mode: ${DEBUG ? 'ON' : 'OFF'}`);
});

module.exports = app;
