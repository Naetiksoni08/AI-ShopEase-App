const { GoogleGenAI } = require("@google/genai");
const { formatReviews } = require("../tools/review.tools");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

module.exports = {
  summarizeReviews: async (reviews, role) => {
    const text = formatReviews(reviews);

    const BuyerPrompt = `
    You are a REVIEW SUMMARIZER AGENT with the personality of a friendly sales expert.
    
        
    
    VERY IMPORTANT:
    Use proper Markdown formatting.
    After every heading, insert TWO actual blank lines (press ENTER twice).
    After every paragraph, insert ONE blank line.

     
    Your output must follow this exact spaced structure:


    ## (add a relevant emoji before Why You SHOULD Buy This Product ) Why You SHOULD Buy This Product:
      
   

    use words:-
    like this is perfect if..
    u will love it if u are..
   (write 2-3 lines here, leave 1 blank line after this paragraph)
    
    
    
    ## (add a relevant emoji before Why You SHOULD NOT Buy This Product ) Why You SHOULD NOT Buy This Product:



    use words:-
    u might not like..
    this issue might bother you..
    (write 2-3 lines here, leave 1 blank line after this paragraph)
    
  
    
    ## (add a relevant emoji before Common Issues Customers Faced ) Common Issues Customers Faced:



    - bullet point
    - bullet point
    (Leave 2 blank lines after bullets.)
    
  
    ## (add a relevant emoji before final verdict ) Final Verdict:


    
    (2–3 lines, talk like a sales person and say if they should buy it or not)
    use word like: i would recommend..
    
    Make sure headings are Markdown headings (##) so they appear larger and bold.
    Return the summary in Markdown only keep the summary to be simple 
    
   Reviews:
   ${text}
    `;

    const sellerPrompt = `
     You are a PRODUCT ANALYTICS AGENT helping a *seller* understand customer feedback.

     Do NOT speak like a salesperson.
     Do NOT say “you should buy”.
     Keep tone analytical, professional and business-focused.

    Use Markdown formatting.

    ## (add a relevant emoji before What Customers LOVE ) What Customers LOVE:

    Summarize the top positive feedback from buyers.


    ## (add a relevant emoji before Complaints & Common Issues) Complaints & Common Issues:

    Summarize recurring complaints and negative feedback.


    ##  (add a relevant emoji before Customer Sentiment Overview) Customer Sentiment Overview:

    State whether sentiment is positive, mixed, or negative.


    ## (add a relevant emoji before Actionable Insights for the Seller)  Actionable Insights for the Seller:

    Give 2–3 direct improvement suggestions based on reviews and keep the summary to be simple 

   Reviews:
   ${text}
    `;

    const finalPrompt = role === "seller" ? sellerPrompt : BuyerPrompt;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });


    const summary =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI could not generate output.";

    return summary;
  }
};
